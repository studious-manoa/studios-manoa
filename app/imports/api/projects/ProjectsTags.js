import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const projectsTagsName = 'ProjectsTags';

/** Define a Mongo collection to hold the data. */
const ProjectsTags = new Mongo.Collection(projectsTagsName);

/** Define a schema to specify the structure of each document in the collection. */
const ProjectTagSchema = new SimpleSchema({
  project: String,
  tag: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
ProjectsTags.attachSchema(ProjectTagSchema);

/** Make the collection and schema available to other code. */
export { ProjectsTags, ProjectTagSchema, projectsTagsName };
