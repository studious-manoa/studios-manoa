import React from 'react';
import { Form, Button, Header, Container, Image, Icon, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2'; // required for Uniforms
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { tagsName } from '../../api/tags/Tags';
import { Profiles, profilesName } from '../../api/profiles/Profiles';
import { profilesTagsName } from '../../api/profiles/ProfilesTags';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allProjects) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  major: { type: String, label: 'Major', optional: true },
  picture: { type: String, label: 'Picture URL', optional: true },
  projects: { type: Array, label: 'Favorite Places', optional: true },
  'projects.$': { type: String, allowedValues: allProjects },
});
/** Renders the Home Page: what appears after the user logs in. */
class Home extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { firstName, lastName, email, major } = data;
    Profiles.update({ firstName, lastName, email, major },
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

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const email = Meteor.user().username;
    // Create the form schema for uniforms. Need to determine all tags and projects for muliselect list.
    const allProjects = _.pluck(Projects.find().fetch(), 'name');
    const formSchema = makeSchema(allProjects);
    // Now create the model with all the user information.
    const projects = _.pluck(ProfilesProjects.find({ profile: email }).fetch(), 'project');
    const profile = Profiles.findOne({ email });
    const model = _.extend({}, profile, { projects });
    return (
        <Container align={'center'}>
          <Form.Group>
            <br/>
            <Header textAlign="center" color={'orange'} as="h1">Edit Profile</Header>
            <AutoForm model={model} schema={formSchema} onSubmit={data => this.submit(data)}>
              <Image src='/images/profilpicture.png' size='small' circular/>
              <br/><Button circular showInlineError={true}><Icon name='picture'/>Change profile picture</Button>
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
                <MultiSelectField align={'left'} name='projects'
                                  showInlineError={true} placeholder={'Projects'}/>
              </Form.Field>
              <SubmitField value='Submit' as={Link} name='submit' to="/UserProfile" />
              <ErrorsField/>
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
