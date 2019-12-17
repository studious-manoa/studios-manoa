import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image, Grid, Header, Icon, Button, Loader, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { tagsName } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { profilesProjectsName } from '../../api/profiles/ProfilesProjects';


/** Gets the Project data as well as Profiles and Tags associated with the passed Project name. */
function getProfileData(email) {
  const data = Profiles.find({ email: email }).fetch();
  console.log(data[0]);
  return data[0];
}

class UserProfiles extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const profileData = getProfileData('botelloe@hawaii.edu');

    return (
        <div><br/>
          <Grid columns={3} padded centered>
            <Grid.Row>
              <Image src={profileData.picture} size='medium' circular/>
            </Grid.Row>
            <Grid.Row>
              <Header color={'orange'} as="h1"> {profileData.firstName} {profileData.lastName}</Header>
            </Grid.Row>
            <Grid.Row>
                <Icon name='mail'/> Mail: {profileData.email}
            </Grid.Row>
              <Grid.Row>
                <Icon name='pencil alternate'/> Major: {profileData.major}
              </Grid.Row>
              <br/>
            <Grid.Row>
              <Icon name='favorite'/> Your Favorite Spot:  {profileData.firstName}
            </Grid.Row>
            <Grid.Row>
              <Button circular color={'orange'}><Icon name='edit'/>
                Edit profile</Button>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

UserProfiles.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(tagsName);
  const sub2 = Meteor.subscribe(profilesName);
  const sub4 = Meteor.subscribe(profilesProjectsName);
  return {
    ready: sub1.ready() && sub2.ready() && sub4.ready(),
  };
})(UserProfiles);
