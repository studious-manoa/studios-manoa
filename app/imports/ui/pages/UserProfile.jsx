import React from 'react';
import { Image, Grid, Header, Icon, Button, Rating } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class UserProfile extends React.Component {
  render() {
    return (
        <div><br/>
          <Grid columns={3} padded centered>
            <Grid.Row>
              <Image src='/images/profilpicture.png' size='medium' circular/>
            </Grid.Row>
            <Grid.Row>
              <Header color={'orange'} as="h1">Ola Nordmann</Header>
            </Grid.Row>
            <Grid.Row divided>
              <Grid.Column width={2} textAlign={'right'}>
                <Icon name='user'/>ONordmann82
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='mail'/>example@hawaii.edu
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name='student'/> Computer Science
              </Grid.Column>
              <br/>
            </Grid.Row>
            <Grid.Row>
              <b>Your Favorite Spot: </b> Hamiltion Library
              <Rating icon='star' defaultRating={3} maxRating={4}/>
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
export default UserProfile;
