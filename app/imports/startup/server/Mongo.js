import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Projects } from '../../api/projects/Projects';
import { ProjectsTags } from '../../api/projects/ProjectsTags';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { ProfilesTags } from '../../api/profiles/ProfilesTags';
import { Tags } from '../../api/tags/Tags';
import { Stuffs } from '../../api/stuff/Stuff.js';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.insert(data);
}

/** Initialize the collection if empty. */
if (Stuffs.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}


/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'foo' });
  if (role === 'admin') {
    Roles.addUsersToRoles(userID, 'admin');
  }
}

/** Define an tag.  Has no effect if tag already exists. */
function addTag(tag) {
  Tags.update({ name: tag }, { $set: { name: tag } }, { upsert: true });
}

/** Defines a new user and associated profile. Error if user already exists. */
function addProfile({ firstName, lastName, bio, title, tags, projects, picture, email, role }) {
  console.log(`Defining profile ${email}`);
  // Define the user in the Meteor accounts package.
  createUser(email, role);
  // Create the profile.
  Profiles.insert({ firstName, lastName, bio, title, picture, email });
  // Add tags and projects.
  tags.map(tag => ProfilesTags.insert({ profile: email, tag }));
  projects.map(project => ProfilesProjects.insert({ profile: email, project }));
  // Make sure tags are defined in the Tags collection if they weren't already.
  tags.map(tag => addTag(tag));
}

/** Define a new project. Error if project already exists.  */
function addProject({ name, homepage, description, tags, picture }) {
  console.log(`Defining project ${name}`);
  Projects.insert({ name, homepage, description, picture });
  tags.map(tag => ProjectsTags.insert({ project: name, tag }));
  // Make sure tags are defined in the Tags collection if they weren't already.
  tags.map(tag => addTag(tag));
}

/** Initialize DB if it appears to be empty (i.e. no users defined.) */
if (Meteor.users.find().count() < 3) {
  if (Meteor.settings.defaultProjects && Meteor.settings.defaultProfiles) {
    console.log('Creating the default profiles');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
    console.log('Creating the default projects');
    Meteor.settings.defaultProjects.map(project => addProject(project));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
