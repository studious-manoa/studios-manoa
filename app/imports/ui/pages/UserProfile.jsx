import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image, Grid, Header, Icon, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';


class UserProfiles extends React.Component {

  render() {
    return (
        <div><br/>
          <Grid columns={3} padded centered>
            <Grid.Row>
              <Image src= '/images/profilpicture.png' size='medium' circular/>
            </Grid.Row>
            <Grid.Row>
              <Header color={'orange'} as="h1"> {this.props.firstName} {this.props.lastName}</Header>
            </Grid.Row>
            <Grid.Row>
                <Icon name='mail'/> Mail: {this.props.email}
            </Grid.Row>
              <Grid.Row>
                <Icon name='pencil alternate'/> Major: {this.props.major}
              </Grid.Row>
              <br/>
            <Grid.Row>
              <Icon name='favorite'/> Your Favorite Spot:  {this.props.projects}
            </Grid.Row>
            <Grid.Row>
              <Button circular color={'orange'} as={Link} to="/EditUserProfile"><Icon name='edit'/>
                Edit profile</Button>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

UserProfiles.propTypes = {
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  major: PropTypes.string,
  projects: PropTypes.string,
};

const up = withTracker(() => ({
  email: Meteor.user() ? Meteor.user().username : '',
  firstName: Meteor.user() ? Meteor.user().firstName : '',
  lastName: Meteor.user() ? Meteor.user().lastName : '',
  major: Meteor.user() ? Meteor.user().major : '',
  projects: Meteor.user() ? Meteor.user().projects : '',
}))(UserProfiles);


export default withRouter(up);
