import React from 'react';
import { Grid, Icon, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SearchBar from '/imports/ui/components/SearchBar';

/* search bar */

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

  render() {
    const titleStyle = {
      fontFamily: 'Staatliches',
      fontSize: '75px',
      color: 'orange',
    };
    const subtitleStyle = {
      fontFamily: 'Quicksand',
      fontSize: '24px',
    };
    return (
        <div className='landing-background'>
          <Grid stackable centered container columns={1}>
            <Grid.Column textAlign='center'>
              <Icon circular inverted name='student' size='massive' color='orange'/>
              <Header inverted as='h1' style={titleStyle}>Studious Manoa</Header>
              <Header inverted as='h3' style={subtitleStyle}>
                Find any study spot in, around, and near the University of Hawaii at Manoa campus.
              </Header>
            </Grid.Column>
            <SearchBar />
          </Grid>
        </div>
    );
  }
}

// export default Landing;
Landing.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default Landing;
