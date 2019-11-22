import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const profilesTagsName = 'ProfilesTags';

/** Define a Mongo collection to hold the data. */
const ProfilesTags = new Mongo.Collection(profilesTagsName);

/** Define a schema to specify the structure of each document in the collection. */
const ProfileTagSchema = new SimpleSchema({
  profile: String,
  tag: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
ProfilesTags.attachSchema(ProfileTagSchema);

/** Make the collection and schema available to other code. */
export { ProfilesTags, ProfileTagSchema, profilesTagsName };
