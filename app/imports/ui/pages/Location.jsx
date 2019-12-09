import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import MapLeaflet from '../components/MapLeaflet';
import { Projects, ProjectsTags, ProjectsRatings } from '/imports/api/projects/Projects';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Location extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div>
          <Header as='h1'>{this.props.project.name}</Header>
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
  const documentId = match.params._id;
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Projects);
  // const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(ProjectsTags);
  // const sub4 = Meteor.subscribe(profilesProjectsName);
  const sub5 = Meteor.subscribe(ProjectsRatings);
  return {
    doc: Projects.findOne(documentId),
    ready: sub1.ready() && sub3.ready() && sub5.ready(),
  };
})(Location);
