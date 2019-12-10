import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Stuffs } from '../../api/stuff/Stuff';
import { tagsName, Tags } from '../../api/tags/Tags';
import { profilesName, Profiles } from '../../api/profiles/Profiles';
import { ProfilesTags, profilesTagsName } from '../../api/profiles/ProfilesTags';
import { ProfilesProjects, profilesProjectsName } from '../../api/profiles/ProfilesProjects';
import { Projects, projectsName } from '../../api/projects/Projects';
import { ProjectsTags, projectsTagsName } from '../../api/projects/ProjectsTags';
import { ProjectsRatings, projectsRatingsValue } from '../../api/projects/ProjectsRatings';
import { Reviews, reviewsName } from '../../api/reviews/Reviews';

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Stuff', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Stuffs.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('StuffAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Stuffs.find();
  }
  return this.ready();
});

/** Define a publication to publish all tags. */
Meteor.publish(tagsName, () => Tags.find());

/** Define a publication to publish all tags. */
Meteor.publish(reviewsName, () => Reviews.find());

/** Define a publication to publish all profiles. */
Meteor.publish(profilesName, () => Profiles.find());

/** Define a publication to publish this collection. */
Meteor.publish(profilesTagsName, () => ProfilesTags.find());

/** Define a publication to publish this collection. */
Meteor.publish(profilesProjectsName, () => ProfilesProjects.find());

/** Define a publication to publish all projects. */
Meteor.publish(projectsName, () => Projects.find());

/** Define a publication to publish this collection. */
Meteor.publish(projectsTagsName, () => ProjectsTags.find());

/** Define a publication to publish this collection. */
Meteor.publish(projectsRatingsValue, () => ProjectsRatings.find());
