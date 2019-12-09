import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const projectsReviewsName = 'ProjectsReviews';

/** Define a Mongo collection to hold the data. */
const ProjectsReviews = new Mongo.Collection(projectsReviewsName);

/** Define a schema to specify the structure of each document in the collection. */
const ProjectReviewSchema = new SimpleSchema({
  project: String,
  review: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
ProjectsReviews.attachSchema(ProjectReviewSchema);

/** Make the collection and schema available to other code. */
export { ProjectsReviews, ProjectReviewSchema, projectsReviewsName };
