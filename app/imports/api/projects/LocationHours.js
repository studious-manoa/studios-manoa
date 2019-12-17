import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

  /** The name of the collection and the global publication.**/
  const locationhoursName = 'Projects';

/** Define a Mongo collection to hold the data. */
const LocationHours = new Mongo.Collection('LocationHours');

/**
 * Define a schema to specify the structure of each document in the collection.
 * -1 means it does not open / close on that day
 * increments of a half hour, so 10 = 5 am, 40 = 8 pm, 41 = 8:30 pm, etc
 * Names must be unique.
 */
const LocationHoursSchema = new SimpleSchema({
  location: { type: String, index: true },
  // 0-6, where 0 is monday and 6 is sunday
  day: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 6,
  },
  open: {
    type: SimpleSchema.Integer,
    min: -1,
    max: 47,
  },
  close: {
    type: SimpleSchema.Integer,
    min: -1,
    max: 47,
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
LocationHours.attachSchema(LocationHoursSchema);

/** Make the collection and schema available to other code. */
export { LocationHours, LocationHoursSchema, locationhoursName };
