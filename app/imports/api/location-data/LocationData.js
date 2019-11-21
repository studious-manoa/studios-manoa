import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Locations = new Mongo.Collection('Locations');

/** Define a schema to specify the structure of each document in the collection. */
const LocationSchema = new SimpleSchema({
  name: String,
  address: String,
  owner: String,
  condition: {
    type: String,
    allowedValues: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: 'good',
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Locations.attachSchema(LocationSchema);

/** Make the collection and schema available to other code. */
export { Locations, LocationSchema };
