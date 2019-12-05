import React from 'react';
import { Form, Button, Header, Container, Image, Icon, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import updateProfileMethod from '../../startup/both/Methods';
import { Tags, tagsName } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { ProfilesTags, profilesTagsName } from '../../api/profiles/ProfilesTags';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allTags, allProjects) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Biographical statement', optional: true },
  title: { type: String, label: 'Title', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
  tags: { type: Array, label: 'Preferences', optional: true },
  'tags.$': { type: String, allowedValues: allTags },
  projects: { type: Array, label: 'Favorite Places', optional: true },
  'projects.$': { type: String, allowedValues: allProjects },
});
/** Renders the Home Page: what appears after the user logs in. */
class Home extends React.Component {

  /** On submit, insert the data. */
  submit(data) {
    Meteor.call(updateProfileMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile updated successfully', 'success');
      }
    });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const email = Meteor.user().username;
    // Create the form schema for uniforms. Need to determine all tags and projects for muliselect list.
    const allTags = _.pluck(Tags.find().fetch(), 'name');
    const allProjects = _.pluck(Projects.find().fetch(), 'name');
    const formSchema = makeSchema(allTags, allProjects);
    // Now create the model with all the user information.
    const projects = _.pluck(ProfilesProjects.find({ profile: email }).fetch(), 'project');
    const tags = _.pluck(ProfilesTags.find({ profile: email }).fetch(), 'tag');
    const profile = Profiles.findOne({ email });
    const model = _.extend({}, profile, { tags, projects });
    return (
        <Container align={'center'}>
          <Form.Group>
            <br/>
            <Header textAlign="center" color={'orange'} as="h1">Edit Profile</Header>
            <AutoForm centered model={model} schema={formSchema} onSubmit={data => this.submit(data)}>
                <Image src='/images/profilpicture.png' size='small' circular/>
                <br/><Button circular><Icon name='picture'/>Change profile picture</Button>
                <Form.Field width={'10'}>
                  <TextField align={'left'} name='firstName' showInlineError={true} placeholder={'First Name'}/>
                </Form.Field>
                  <Form.Field width={'10'}>
                  <TextField align={'left'} name='lastName' showInlineError={true} placeholder={'Last Name'}/>
                  </Form.Field>
                    <Form.Field width={'10'}>
                  <TextField align={'left'} name='email' showInlineError={true} placeholder={'email'} disabled/>
                </Form.Field>
              <Form.Field width={'10'}>
                <LongTextField align={'left'} name='bio' placeholder='Write a little bit about yourself.'/>
              </Form.Field>
              <Form.Field width={'10'}>
                  <TextField align={'left'} name='title' showInlineError={true} placeholder={'Title'}/>
              </Form.Field>
                  <Form.Field width={'10'}>
                  <TextField align={'left'} name='picture' showInlineError={true} placeholder={'URL to picture'}/>
                  </Form.Field>
                <Form.Field width={'10'}>
                  <MultiSelectField align={'left'} name='tags' showInlineError={true} placeholder={'Tags'}/>
                  <MultiSelectField align={'left'} name='projects' showInlineError={true} placeholder={'Projects'}/>
                </Form.Field>
                <Button circular color={'orange'} value='Update' as={Link} to="/UserProfile"><Icon name='save'/>
                  Submit changes</Button>
            </AutoForm>
          </Form.Group>
        </Container>
    );
  }
}


Home.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(tagsName);
  const sub2 = Meteor.subscribe(profilesName);
  const sub3 = Meteor.subscribe(profilesTagsName);
  const sub4 = Meteor.subscribe(profilesProjectsName);
  const sub5 = Meteor.subscribe(projectsName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(Home);
