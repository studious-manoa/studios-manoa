import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication.
 * const projectsName = 'Projects';*/

/** Define a Mongo collection to hold the data. */
const LocationHours = new Mongo.Collection('LocationHours');

/**
 * Define a schema to specify the structure of each document in the collection.
 * Names must be unique.
 */
const LocationHoursSchema = new SimpleSchema({
  location: { type: String, index: true, unique: true },
  day: { type: Number },
  open: { type: Number, optional: true },
  close: { type: Number, optional: true },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
LocationHours.attachSchema(LocationHoursSchema);

/** Make the collection and schema available to other code. */
export { LocationHours, LocationHoursSchema };
