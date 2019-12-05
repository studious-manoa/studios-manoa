import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const ratingsValue = 'Ratings';

/** Define a Mongo collection to hold the data. */
const Ratings = new Mongo.Collection(ratingsValue);

/**
 * Define a schema to specify the structure of each document in the collection.
 * Names must be unique.
 * */
const RatingSchema = new SimpleSchema({
  value: { type: Number, index: true },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Ratings.attachSchema(RatingSchema);

/** Make the collection and schema available to other code. */
export { Ratings, RatingSchema, ratingsValue };
