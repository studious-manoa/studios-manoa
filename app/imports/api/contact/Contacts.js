import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Contacts = new Mongo.Collection('Contacts');

/** Define a schema to specify the structure of each document in the collection. */
const ContactSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  address: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Contacts.attachSchema(ContactSchema);

/** Make the collection and schema available to other code. */
export { Contacts, ContactSchema };
