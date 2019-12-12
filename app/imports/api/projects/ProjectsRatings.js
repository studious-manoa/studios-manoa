import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const projectsRatingsValue = 'ProjectsRatings';

/** Define a Mongo collection to hold the data. */
const ProjectsRatings = new Mongo.Collection(projectsRatingsValue);

/** Define a schema to specify the structure of each document in the collection. */
const ProjectRatingSchema = new SimpleSchema({
  project: { type: String, index: true },
  user: { type: String, optional: true },
  rating: {
    type: Number,
    allowedValues: [1, 2, 3, 4, 5],
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
ProjectsRatings.attachSchema(ProjectRatingSchema);

/** Make the collection and schema available to other code. */
export { ProjectsRatings, ProjectRatingSchema, projectsRatingsValue };
