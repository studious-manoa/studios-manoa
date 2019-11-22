import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** The name of the collection and the global publication. */
const tagsName = 'Tags';

/** Define a Mongo collection to hold the data. */
const Tags = new Mongo.Collection(tagsName);

/**
 * Define a schema to specify the structure of each document in the collection.
 * Names must be unique.
 * */
const TagSchema = new SimpleSchema({
  name: { type: String, index: true, unique: true },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Tags.attachSchema(TagSchema);

/** Make the collection and schema available to other code. */
export { Tags, TagSchema, tagsName };
