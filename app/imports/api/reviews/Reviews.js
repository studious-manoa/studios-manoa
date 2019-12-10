import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const reviewsName = 'Reviews';

/** Define a Mongo collection to hold the data. */
const Reviews = new Mongo.Collection(reviewsName);

/** Define a schema to specify the structure of each document in the collection. */
const ReviewSchema = new SimpleSchema({
  name: { type: String, index: true },
  rating: Number,
  owner: String,
  description: String,
  location: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Reviews.attachSchema(ReviewSchema);

/** Make the collection and schema available to other code. */
export { Reviews, ReviewSchema, reviewsName };
