import React from 'react';
import { Grid, Segment, Header, Form, Loader } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import AutoField from 'uniforms-semantic/AutoField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import swal from 'sweetalert';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Tags, tagsName } from '../../api/tags/Tags';
// import { Profiles, profilesName } from '../../api/profiles/Profiles';
// import { ProfilesTags, profilesTagsName } from '../../api/profiles/ProfilesTags';
// import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags, projectsTagsName } from '../../api/projects/ProjectsTags';
import MapField from '../forms/controllers/MapField';

/** Create a schema to specify the structure of the data to appear in the form. */

const makeSchema3 = (allTags, allProjects) => new SimpleSchema({
  name: { type: String, label: 'Name', optional: true },
  description: { type: String, label: 'Description', optional: true },
  homepage: { type: String, label: 'Homepage', optional: true },
  picture: { type: String, label: 'Picture', optional: true },
  latlng: {
    type: Object,
    uniforms: {
      component: MapField,
    },
  },
  'latlng.lat': Number,
  'latlng.lng': Number,
  tags: { type: Array, label: 'Tags', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
  projects: { type: Array, label: 'Projects', optional: true },
  'projects.$': { type: String, allowedValues: allProjects },
});

/** Renders the Home Page: what appears after the user logs in. */
class EditProject extends React.Component {

  /** On submit, insert the data. */
  submit(data) {
    const { name, description, homepage, picture, tags, _id } = data;
    // selectedProject = name;
    console.log(_id);
    const lat = data.latlng.lat;
    const long = data.latlng.lng;
    // const project = Projects.findOne({ selectedProject });
    Projects.update(_id, { $set: { name, description, homepage, lat, long, picture, tags } }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
    ProjectsTags.find({ project: name }).forEach(function (doc) {
      ProjectsTags.remove({ _id: doc._id });
    });
    // ProjectsTags.remove({ project: name });
    tags.map((tag) => ProjectsTags.insert({ project: name, tag }));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    // Create the form schema for uniforms. Need to determine all tags and projects for muliselect list.
    const allTags = _.pluck(Tags.find().fetch(), 'name');
    const projects = _.pluck(Projects.find().fetch(), 'name');
    // const tags = _.pluck(ProjectsTags.find({ project: 'Post' }).fetch(), 'tag');
    const formSchema = makeSchema3(allTags, projects);
    // Now create the model with all the user information.
    // const stuff = Projects.findOne({ name: 'Post' });
    // const model = _.extend({}, stuff, { tags });

    const locationStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      fontFamily: 'Quicksand',
    };
    const pageStyle = {
      fontFamily: 'Staatliches',
      color: 'orange',
    };

    return (
      <Grid container centered style={locationStyle}>
        <Grid.Column>
          <Header as="h2" textAlign="center" style={pageStyle}>Edit Location Profile</Header>
          <AutoForm model={this.props.doc} schema={formSchema} onSubmit={data => this.submit(data)}>
            <Segment>
              <LongTextField name='description' placeholder='Write a little bit about the location.'/>
              <Form.Group widths={'equal'}>
                <TextField name='name' showInlineError={true} placeholder={'Name'} disabled/>
                <TextField name='homepage' showInlineError={true} placeholder={'Homepage'}/>
                <TextField name='picture' showInlineError={true} placeholder={'URL to picture'}/>
              </Form.Group>
              <Header as='h3'>Drag the marker on the map to the study spot&apos;s location.</Header>
              <AutoField name='latlng'/>
              <Form.Group widths={'equal'}>
                <MultiSelectField name='tags' showInlineError={true} placeholder={'Tags'}/>
              </Form.Group>
              <SubmitField value='Update'/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

EditProject.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(tagsName);
  // const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(projectsTagsName);
  // const sub4 = Meteor.subscribe(profilesProjectsName);
  const sub5 = Meteor.subscribe(projectsName);
  return {
    doc: Projects.findOne(documentId),
    ready: sub1.ready() && sub3.ready() && sub5.ready(),
  };
})(EditProject);
