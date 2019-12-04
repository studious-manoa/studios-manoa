import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader, Grid, Header, Card } from 'semantic-ui-react';
import { Stuffs } from '/imports/api/stuff/Stuff';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import MapLeaflet from '../components/MapLeaflet';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Location extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Grid centered columns={2}>
          <Grid.Column width={5}>
            <Header textAlign='center' as='h1'>Paradise Palms</Header>
            <Card centered>
              <Card.Content>
                <Grid>
                  <Grid.Row>
                    <Grid.Column textAlign='left'>
                      <Header as='h5'>Mon</Header>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                      <Header as='h5'>8:00am-4:30pm</Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={4}>
            <MapLeaflet lat={21.301} lng={-157.8157} zoom={17}
                        popupText='Paradise Palms'></MapLeaflet>
            <Header textAlign='center' color="grey" as='h4'>2560 McCarthy Mall, Honolulu, HI 96822</Header>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Location.propTypes = {
  stuffs: PropTypes.array.isRequired,
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
})(Location);
