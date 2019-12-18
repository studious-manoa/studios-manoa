import React from 'react';
import { Grid, Segment, Header, Loader, Container } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import LongTextField from 'uniforms-semantic/LongTextField';
import AutoField from 'uniforms-semantic/AutoField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Reviews, reviewsName } from '../../api/reviews/Reviews';
import { Projects, projectsName } from '../../api/projects/Projects';
import RatingField from '../forms/controllers/RatingField';

/** Create a schema to specify the structure of the data to appear in the form. */
// const formSchema = new SimpleSchema({
const makeSchema = new SimpleSchema({
  rating: {
    type: SimpleSchema.Integer,
    allowedValues: [1, 2, 3, 4, 5],
    uniforms: {
      component: RatingField,
    },
  },
  review: String,
});

/** Renders the Page for adding a document. */
class AddReview extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef, location) {
    const rating = data.rating;
    const body = data.review;
    const submitter = Meteor.user().username;
    console.log(Reviews.findOne({ location: location, submitter: submitter }));
    console.log(location);
    if (typeof Reviews.findOne({ location: location, submitter: submitter }) !== 'undefined') {
      swal('Error', 'You have already submitted a review for this study spot.', 'error');
    } else {
      Reviews.insert({ submitter, rating, body, location },
          (error) => {
            if (error) {
              swal('Error', error.message, 'error');
            } else {
              swal('Success', 'Item added successfully', 'success');
              formRef.reset();
            }
          });
    }
  }

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    let fRef = null;
    const formSchema = makeSchema;
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
            <Header as="h1" textAlign="center" style={pageStyle}>Review for {this.props.location.name}</Header>
            <AutoForm ref={ref => { fRef = ref; }}
                      schema={formSchema} onSubmit={data => this.submit(data, fRef, this.props.location._id)} >
              <Segment>
                <Container>
                  <AutoField name='rating'/>
                </Container>
                <LongTextField name='review'/>
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
  location: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const locationId = match.params._id;
  const sub = Meteor.subscribe(reviewsName);
  const sub2 = Meteor.subscribe(projectsName);
  // console.log(sub.ready() && sub2.ready());
  return {
    location: Projects.findOne(
        { _id: locationId },
    ),
    ready: sub.ready() && sub2.ready(),
  };
})(AddReview);
