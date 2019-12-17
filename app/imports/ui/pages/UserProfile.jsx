import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image, Grid, Header, Icon, Button, Loader, Modal, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import SimpleSchema from 'simpl-schema';
import { tagsName } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = () => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  major: { type: String, label: 'Major', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
});

/** Gets the Project data as well as Profiles and Tags associated with the passed Project name. */
function getProfileData(email) {
  const data = Profiles.find({ email: email }).fetch();
  console.log(data[0]);
  return data[0];
}

class UserProfiles extends React.Component {
  state = { open: false }

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true });
  }

  close = () => this.setState({ open: false })

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { email, firstName, lastName, major, picture } = data;
    console.log('submitted dakine');
    Profiles.update({ email, firstName, lastName, major, picture },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Project added successfully', 'success');
            formRef.reset();
          }
        });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const profileData = getProfileData(Meteor.user().username);
    const { open, closeOnEscape, closeOnDimmerClick } = this.state;

    const email = Meteor.user().username;
    // Create the form schema for uniforms. Need to determine all tags and projects for muliselect list.
    const allProjects = _.pluck(Projects.find().fetch(), 'name');
    const formSchema = makeSchema(allProjects);
    // Now create the model with all the user information.
    const projects = _.pluck(ProfilesProjects.find({ profile: email }).fetch(), 'project');
    const profile = Profiles.findOne({ email });
    const model = _.extend({}, profile, { projects });
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
              <Button circular color={'orange'} onClick={this.closeConfigShow(false, true)}><Icon name='edit'/>
                Edit profile</Button>
            </Grid.Row>
          </Grid>
          <Modal
              open={open}
              closeOnEscape={closeOnEscape}
              closeOnDimmerClick={closeOnDimmerClick}
              onClose={this.close}
              closeIcon
          >
            <Modal.Header><Header textAlign="center" color={'orange'} as="h1">Edit Profile</Header></Modal.Header>
            <Modal.Content>
              <Form.Group>
                <br/>
                <AutoForm model={model} schema={formSchema} onSubmit={data => this.submit(data)}>
                  <Image src={profileData.picture} size='small' circular/>
                  <Form.Field width={'10'}>
                    <TextField align={'left'} name='firstName' showInlineError={true} placeholder={'First Name'}/>
                  </Form.Field>
                  <Form.Field width={'10'}>
                    <TextField align={'left'} name='lastName' showInlineError={true} placeholder={'Last Name'}/>
                  </Form.Field>
                  <Form.Field width={'10'}>
                    <TextField align={'left'} name='email' showInlineError={true} placeholder={'Email'} />
                  </Form.Field>
                  <Form.Field width={'10'}>
                    <TextField align={'left'} name='major' showInlineError={true} placeholder={'Major'}/>
                  </Form.Field>
                  <Form.Field width={'10'}>
                    <TextField align={'left'} name='picture' showInlineError={true} placeholder={'Picture URL'}/>
                  </Form.Field>
                  <SubmitField value='Submit' name='submit' />
                  <ErrorsField/>
                </AutoForm>
              </Form.Group>
            </Modal.Content>
          </Modal>
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
