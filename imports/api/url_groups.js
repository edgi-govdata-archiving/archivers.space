import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const UrlGroups = new Mongo.Collection('urlGroups');
export default UrlGroups;

// with documents like { urlIds: [urlId1, urlId2] },
//                     { urlIds: [urlId3, urlId4,urlId5] }

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('urlGroups', () => {
    const urlGroups = UrlGroups.find({});
    return urlGroups;
  });
}


Meteor.methods({
  'urlGroups.link': function urlGroupLink(urlId1, urlId2) {
    check(urlId1, String);
    check(urlId2, String);

    // If a document already exists with either of these urls in it, add
    // the other one.
    const group = UrlGroups.findOne({ urlIds: { $elemMatch: { $in: [urlId1, urlId2] } } });
    if (group) {
      UrlGroups.update(group._id,
        { $addToSet: { urlIds: { $each: [urlId1, urlId2] } } });
    } else {
      UrlGroups.insert({ urlIds: [urlId1, urlId2] });
    }
    // MongoDB provides a better way to do this using $push and upsert,
    // but it is not supported by minimongo.
  },

  'urlGroups.unlink': function urlGroupUnlink(urlId) {
    check(urlId, String);

    // Remove this url from the group that it is in.
    const group = UrlGroups.findOne({ urlIds: { $elemMatch: { $eq: urlId } } });
    UrlGroups.update(group._id, { $pull: { urlIds: urlId } });
  },
});
