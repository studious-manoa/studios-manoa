import React from 'react';
import { Grid, Icon, Header, Search } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    const titleStyle = {
      fontFamily: 'Staatliches',
      fontSize: '75px',
    };
    const subtitleStyle = {
      fontFamily: 'Quicksand',
      fontSize: '24px',
    };
    return (
        <div className='landing-background'>
          <Grid stackable centered container columns={1}>
            <Grid.Column textAlign='center'>
              <Icon inverted name='student' size='massive' />
              <Header inverted as='h1' style={titleStyle}>Studious Manoa</Header>
              <Header inverted as='h3' style={subtitleStyle}>
                Find any study spot in, around, and near the University of Hawaii at Manoa campus.
              </Header>
            </Grid.Column>
            <br />
            <br />
            <Search
                fluid
                placeholder='Search for a Location'
            />
          </Grid>
        </div>
    );
  }
}

export default Landing;
