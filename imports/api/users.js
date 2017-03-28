import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import Analytics from '../libs/analytics';

if (Meteor.isServer) {
  Meteor.publish('userList', () => {
    const userList = Meteor.users.find({
      'roles.__global_roles__': { $nin: ['root'] },
    }, {
      fields: {
        _id: 1,
        username: 1,
        roles: 1,
        lock_url_uuid: 1,
      },
    });
    return userList;
  });
}

Meteor.methods({
  'users.getUsername': function userGetUsername(userId) {
    check(userId, String);
    return Meteor.users.find(userId);
  },

  'users.setUsername': function userSetUsername(userId, username) {
    check(userId, String);
    check(username, String);
    // TODO - currently throwing an error here isn't invoking the provided callback
    // make that work
    if (userId !== this.userId) {
      throw new Meteor.Error('acces-denied');
    }
    if (Meteor.users.findOne({ username: username.toLowerCase() })) {
      throw new Meteor.Error('username already exists');
    }

    Meteor.users.update(userId, { $set: { username } });
  },

  'users.makeAdmin': function userMakeAdmin(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'root', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Added Admin", { userId });
    Roles.addUsersToRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
  },

  'users.removeAdmin': function userRemoveAdmin(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'root', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Removed Admin", { userId });
    Roles.removeUsersFromRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
  },

  'users.makeChecker': function userMakeChecker(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Added Checker", { userId });
    Roles.addUsersToRoles(userId, ['checker'], Roles.GLOBAL_GROUP);
  },

  'users.removeChecker': function userRemoveChecker(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Removed Checker", { userId });
    Roles.removeUsersFromRoles(userId, ['checker'], Roles.GLOBAL_GROUP);
  },

  'users.makeBagger': function userMakeBagger(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Added Bagger", { userId });
    Roles.addUsersToRoles(userId, ['bagger'], Roles.GLOBAL_GROUP);
  },

  'users.removeBagger': function userRemoveBagger(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Removed Bagger", { userId });
    Roles.removeUsersFromRoles(userId, ['bagger'], Roles.GLOBAL_GROUP);
  },

  'users.makeDescriber': function userMakeDescriber(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Added Describer", { userId });
    Roles.addUsersToRoles(userId, ['describer'], Roles.GLOBAL_GROUP);
  },

  'users.removeDescriber': function userRemoveDescriber(userId) {
    check(userId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    } else if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }
    Analytics.track("Removed Describer", { userId });
    Roles.removeUsersFromRoles(userId, ['describer'], Roles.GLOBAL_GROUP);
  },
});
