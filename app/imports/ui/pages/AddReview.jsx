import React from 'react';
import { Reviews } from '/imports/api/review/Reviews';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import NumField from 'uniforms-semantic/NumField';
import LongTextField from 'uniforms-semantic/src/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';
import { Projects } from '../../api/projects/Projects';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allLocations) => new SimpleSchema({
  location: {
    type: String,
    allowedValues: allLocations,
  },
  name: String,
  rating: {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
  },
  description: String,
});

/** Renders the Page for adding a document. */
class AddReview extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { location, name, rating, description } = data;
    const owner = Meteor.user().username;
    Reviews.insert({ location, name, rating, description, owner },
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
                <SelectField name='location' showInlineError={true} placeholder='Choose a location'/>
                <TextField name='name' showInlineError={true}/>
                <NumField name='rating' showInlineError={true} decimal={false}/>
                <LongTextField showInlineError={true} name='description'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddReview;
