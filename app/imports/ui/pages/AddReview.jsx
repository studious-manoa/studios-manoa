import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import NumField from 'uniforms-semantic/NumField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Reviews, reviewsName } from '../../api/reviews/Reviews';
import { tagsName } from '../../api/tags/Tags';
import { profilesName } from '../../api/profiles/Profiles';
import { profilesTagsName } from '../../api/profiles/ProfilesTags';
import { profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsRatings } from '../../api/projects/ProjectsRatings';

/** Create a schema to specify the structure of the data to appear in the form. */
// const formSchema = new SimpleSchema({
const makeSchema = (allLocations) => new SimpleSchema({
  name: String,
  rating: Number,
  description: String,
  location: {
    type: String,
    allowedValues: allLocations,
  },
});

/** Renders the Page for adding a document. */
class AddReview extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { name, rating, description, location } = data;
    const owner = Meteor.user().username;
    ProjectsRatings.insert({ project: location, rating: rating });
    Reviews.insert({ name, rating, owner, description, location },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const allLocations = _.pluck(Projects.find().fetch(), 'name');
    const formSchema = makeSchema(allLocations);
    const reviewStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      fontFamily: 'Quicksand',
    };
    const pageStyle = {
      fontFamily: 'Staatliches',
      color: 'orange',
    };
    return (
        <Grid container centered style={reviewStyle}>
          <Grid.Column>
            <Header as="h1" textAlign="center" style={pageStyle}>Reviews</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <TextField name='name'/>
                <NumField name='rating' decimal={false}/>
                <TextField name='description'/>
                <SelectField name='location'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

AddReview.propTypes = {
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
  const sub6 = Meteor.subscribe(reviewsName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready(),
  };
})(AddReview);
