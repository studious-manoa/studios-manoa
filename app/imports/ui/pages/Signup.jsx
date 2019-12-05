import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter,  Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Menu } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default class Signup extends React.Component {

  /** Initialize component state with properties for login and redirection. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signup submission using Meteor's account mechanism. */
  submit = () => {
    const { email, password } = this.state;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Render the signup form. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/add' } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    // Otherwise return the Login form.
    return (

        <Container>
          <Grid textAlign="center" verticalAlign="middle" padded centered columns={2}>
            <Grid.Column width={15}>
              <div style={{ height: '30px' }}/>
              <Header as="h2" textAlign="center" size="huge">
                Create new user
              </Header>
              <Form onSubmit={this.submit}>
                <Container textAlign='center' style={{ height: '400px', borderRadius: '10px' }}>
                  <div style={{ height: '20px' }}/>
                  <Form.Input
                      name="Name"
                      placeholder="Full name"
                      type="name"
                      onChange={this.handleChange}
                      style={{ width: '45%' }}

                  />
                  <div style={{ height: '10px' }}/>
                  <Form.Input
                      name="email"
                      type="email"
                      placeholder="E-mail address"
                      onChange={this.handleChange}
                      style={{ width: '45%' }}

                  />
                  <div style={{ height: '10px' }}/>
                  <Form.Input
                      name="Major"
                      placeholder="Major"
                      type="major"
                      onChange={this.handleChange}
                      style={{ width: '45%' }}

                  />
                  <div style={{ height: '10px' }}/>
                  <Form.Input
                      name="password"
                      placeholder="Password"
                      type="password"
                      onChange={this.handleChange}
                      style={{ width: '45%' }}


                  />
                  <div style={{ height: '10px' }}/>
                  {/* eslint-disable-next-line max-len */}
                  <Form.Button style={{ width: '45%', backgroundColor: '#ED9921', color: '#FCF3E1' }} content="Submit"/>
                  <div style={{ height: '10px' }}/>
                  <a as={NavLink} exact to="/signin" style={{ color: '#767676' }}>Click here to login</a>
                  <Menu.Item icon="sign in" text="Sign In" as={NavLink} exact to="/signin"/>
                </Container>
              </Form>
              {this.state.error === '' ? (
                  ''
              ) : (
                  <Message
                      error
                      header="Login was not successful"
                      content={this.state.error}
                  />
              )}
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};
