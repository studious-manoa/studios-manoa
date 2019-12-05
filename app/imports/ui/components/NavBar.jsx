import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = {
      fontFamily: 'Staatliches',
      fontSize: '16px',
      backgroundColor: '#434343',
      color: 'orange',
    };
    return (
      <Menu style={menuStyle} attached="top" borderless inverted>
        <Menu.Item><Icon circular inverted name='student' color='orange' size='big'/></Menu.Item>
        <Menu.Item as={NavLink} activeClassName="" exact to="/">
          {/* eslint-disable-next-line max-len */}
          <Header inverted as='h1' style={{ color: 'orange', fontFamily: 'Staatliches' }}>Studious Manoa</Header>
        </Menu.Item>
        {/* eslint-disable-next-line max-len */}
        <Menu.Item as={NavLink} activeClassName="active" exact to="/locations" key='projects'>Locations</Menu.Item>
        <Menu.Item as={NavLink} activeClassName="active" exact to="/filter" key='filter'>Filter</Menu.Item>
        {this.props.currentUser ? (
            [<Menu.Item as={NavLink} activeClassName="active" exact to="/reviews" key='reviews'>Reviews</Menu.Item>,
              <Menu.Item as={NavLink} activeClassName="active" exact to="/userprofile" key='userprofile'>
                My Profile</Menu.Item>,
              // <Menu.Item as={NavLink} activeClassName="active" exact to="/editUserProfile" key='editUserProfile'>
               // Edit Profile</Menu.Item>
            ]
        ) : ''}
        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            // eslint-disable-next-line max-len
            [<Menu.Item as={NavLink} activeClassName="active" exact to="/projectsAdmin" key='projectsAdmin'>Edit Locations</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/addProject" key='addP'>Add Location</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/profiles" key='profiles'>Profiles</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/tags" key='tags'>Tags</Menu.Item>,
            <Menu.Item as={NavLink} activeClassName="active" exact to="/admin" key='admin'>Admin</Menu.Item>]
        ) : ''}
        <Menu.Item position="right">
          {this.props.currentUser === '' ? (
            <Dropdown text="Login" pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin"/>
                {/* eslint-disable-next-line max-len */}
                <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup" />
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
