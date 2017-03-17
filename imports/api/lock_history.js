import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const LockHistory = new Mongo.Collection('lockHistory');
export default LockHistory;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('lockHistory', () => {
    const lockHistory = LockHistory.find({});
    return lockHistory;
  });
}


Meteor.methods({
  'lockHistory.listContributors': function lockHistoryListContributors(urlId) {
    check(urlId, String);

    const locks = LockHistory.find({ url: urlId });
    const users = locks.map(lock => lock.user);
    const uniqUsers = new Set(users);
    const usernames = Array.from(uniqUsers).map(u => Meteor.users.findOne(u).username);
    return usernames;
  },
});
