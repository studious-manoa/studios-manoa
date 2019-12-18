import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader, Header, Image, Card, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router-dom';
import { Projects, projectsName } from '/imports/api/projects/Projects';
import { Reviews, reviewsName } from '/imports/api/reviews/Reviews';
import MapLeaflet from '../components/MapLeaflet';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Location extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  displayReviews() {
    const reviews = Reviews.find({ location: this.props.project._id }).fetch();
    // if there are no reviews, it will say there are no reviews.
    if (reviews.length === 0) return <div> This location doesn&apos;t have any reviews yet. </div>;
    // if there are reviews, they will be displayed.
    // displays the 10 most recent reviews in cards
    return (
        <div>
          <Header as='h2' style={{ fontFamily: 'Quicksand' }}>Recent reviews</Header>
          {_.map(reviews, review => <Card>
            <Card.Content>
              <Card.Header as='h3'> {review.rating} / 5 </Card.Header>
              <Card.Meta>{review.submitter}</Card.Meta>
              <Card.Description> {review.body}</Card.Description>
            </Card.Content>
          </Card>)}
        </div>
    );
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    console.log(this.props.project);
    const lat = this.props.project.lat;
    const lng = this.props.project.long;

    const locationStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      fontFamily: 'Quicksand',
    };
    const titleStyle = {
      fontFamily: 'Staatliches',
      fontSize: '50px',
      color: 'orange',
    };
    const headerStyle = {
      fontFamily: 'Quicksand',
      fontSize: '25px',
      color: 'black',
      marginTop: '20px',
      marginBottom: '20px',
    };
    const cardStyle = {
      fontFamily: 'Quicksand',
      fontSize: '14px',
      color: 'black',
      marginTop: '20px',
      marginBottom: '20px',
    };
    const imageStyle = {
      height: '500px',
      width: '500px',
    };
    const marginsOnly = {
      marginTop: '20px',
      marginBottom: '20px',
    };
    return (
        <div style={locationStyle}>
          <Grid centered container columns={2} style={marginsOnly}>
            <Grid.Column>
              <Image fluid bordered rounded src={this.props.project.picture} style={imageStyle}/>
            </Grid.Column>
            <Grid.Column>
              <Header as='h1' textAlign='center' style={titleStyle}>{this.props.project.name}</Header>
              <Header as='h2' textAlign='center' style={headerStyle}>{this.props.project.description}</Header>
              <div style={cardStyle}>{this.displayReviews()}</div>
              {/* eslint-disable-next-line max-len */}
              <Link to={`/review/${this.props.project._id}`} style={{ fontSize: '20px', fontFamily: 'Quicksand', marginTop: '10px' }}>Add a review for this location.</Link>

            </Grid.Column>
          </Grid>
          <MapLeaflet lat={lat} lng={lng}
                      zoom={17} locations={[[this.props.project.name, lat, lng]]}
                      fluid
          >
          </MapLeaflet>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Location.propTypes = {
  project: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const locationName = match.params.name;
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(projectsName);
  // const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(reviewsName);
  // const sub4 = Meteor.subscribe(profilesProjectsName);
  console.log(match.params.name)
  return {
    project: Projects.findOne(
        { name: locationName },
    ),
    ready: sub1.ready() && sub3.ready(),
  };
})(Location);
