import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Invites = new Mongo.Collection('invites');
export default Invites;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('invites', () => {
    const invites = Invites.find({});
    return invites;
  });
}

function newInvite(props, userId) {
  return Object.assign({
    createdAt: new Date(),
    creator: userId,
  }, props);
}

Meteor.methods({
  'invites.insert': function inviteInsert(invite) {
    check(invite, Object);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Invites.insert(newInvite(invite, this.userId));
  },

  'invites.update': function inviteUpdate(inviteId, changes) {
    check(inviteId, String);
    check(changes, Object);

    const invite = Invites.findOne(inviteId);

    if (changes.invite && changes.invite !== invite.invite) {
      const exists = Invites.findOne({ invite: changes.invite });
      if (exists) {
        throw new Meteor.Error('invite already exists');
      }
    }
    Invites.update(invite._id, { $set: changes });
  },

  'invites.remove': function inviteRemove(inviteId) {
    check(inviteId, String);

    const invite = Invites.findOne(inviteId);
    if (invite.private && invite.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Invites.remove(inviteId);
  },
});
