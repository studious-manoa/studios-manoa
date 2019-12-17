import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import AutoField from 'uniforms-semantic/AutoField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { tagsName, Tags } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { profilesTagsName } from '../../api/profiles/ProfilesTags';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags } from '../../api/projects/ProjectsTags';
import { LocationHours, locationhoursName } from '../../api/projects/LocationHours';
import MapField from '../forms/controllers/MapField';
import BusinessHoursField from '../forms/controllers/BusinessHoursField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allTags, allParticipants) => new SimpleSchema({
  name: String,
  description: String,
  homepage: {
    type: String,
    optional: true,
  },
  picture: String,
  latlng: {
    type: Object,
    uniforms: {
      component: MapField,
    },
  },
  hours: {
    type: Array,
    uniforms: {
      component: BusinessHoursField,
    },
  },
  'hours.$': Array,
  'hours.$.$': SimpleSchema.Integer,
  'latlng.lat': Number,
  'latlng.lng': Number,
  tags: { type: Array, label: 'Tags', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
  participants: { type: Array, label: 'Participants', optional: true },
  'participants.$': { type: String, allowedValues: allParticipants },
});

/** Renders the Page for adding a document. */
class AddProject extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { name, description, homepage, picture, tags, participants } = data;
    const lat = data.latlng.lat;
    const long = data.latlng.lng;
    if (typeof Projects.findOne({ name: name }) === 'undefined') {
      Projects.insert({ name, description, lat, long, picture, homepage },
          (error) => {
            if (error) {
              swal('Error', error.message, 'error');
            } else {
              swal('Success', 'Location added successfully', 'success');
              formRef.reset();
            }
          });
      for (let i = 0; i < 7; i++) {
        console.log(LocationHours.insert({ location: name, day: i, open: data.hours[i][0], close: data.hours[i][1] }));
      }
      tags.map((tag) => ProjectsTags.insert({ project: name, tag }));
      participants.map((participant) => ProfilesProjects.insert({ project: name, profile: participant }));
    } else {
      swal('Error', `${name} has already been posted to the site!`, 'error');
    }
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const allTags = _.pluck(Tags.find().fetch(), 'name');
    const allParticipants = _.pluck(Profiles.find().fetch(), 'email');
    const formSchema = makeSchema(allTags, allParticipants);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Location</Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={formSchema} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <Form.Group widths={'equal'}>
                  <TextField name='name' showInlineError={true} placeholder='Location name'/>
                  <TextField name='picture' showInlineError={true} placeholder='URL of a picture of the location'/>
                  <TextField name='homepage' showInlineError={true} placeholder='Website URL (optional)'/>
                </Form.Group>
                <Header as='h3'>Drag the marker on the map to the study spot&apos;s location.</Header>
                <AutoField name='latlng'/>
                <LongTextField name='description'
                               placeholder='Describe everything we need to know about the location here.'/>
                <Grid columns='equal'>
                  <Grid.Column>
                    <MultiSelectField name='tags' showInlineError={true} placeholder={'Tags'}/>
                  </Grid.Column>
                  <Grid.Column>
                    <AutoField name='hours'/>
                  </Grid.Column>
                </Grid>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

AddProject.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(tagsName);
  const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(profilesTagsName);
  const sub4 = Meteor.subscribe(profilesProjectsName);
  const sub5 = Meteor.subscribe(projectsName);
  const sub6 = Meteor.subscribe(locationhoursName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
  };
})(AddProject);
