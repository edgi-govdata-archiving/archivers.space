/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';
import { Roles } from 'meteor/alanning:roles';

import '../imports/api/agencies';
import '../imports/api/events';
import Invites from '../imports/api/invites';
import '../imports/api/lock_history';
import '../imports/api/programs';
import '../imports/api/urls';
import '../imports/api/url_groups';
import '../imports/api/users';

if (process.env.NODE_ENV === 'production') {
  import '../imports/api/spreadsheet_ingest';
}

// Empty database will need at least one user
// this method creates a root user.
function createRootUser() {
  // All users need an invite
  Invites.insert({
    createdAt: new Date(),
    used: false,
  }, (err, inviteId) => {
    if (err) {
      console.log('error creating root invite:', err);
      return;
    }
    console.log('created root invite:', inviteId);
    const rootId = Accounts.createUser({
      invitationId: inviteId,
      username: '_root_',
      password: 'change_this_password_right_now',
      hidden: true,
    });

    if (!rootId) {
      console.log('error creating root user:');
      return;
    }

    Roles.addUsersToRoles(rootId, ['admin', 'root'], Roles.GLOBAL_GROUP, () => {
      if (err) {
        console.log('error adding user root role:');
        console.log(err);
        return;
      }

      console.log('created root user with root role.');
    });
  });
}

Meteor.startup(() => {
  // code to run on server at startup

  // b/c app is invite only, we need a root user to generate initial invites
  // if no user exists.
  // ** HELL HATH NO FURY LIKE THOSE WHO DON'T CHANGE DEFAULT PASSWORDS **
  const userCount = Meteor.users.find({}).count();
  if (userCount === 0) {
    console.log('No users found, creating root user');
    createRootUser();
  }
});

// Helpful: http://stackoverflow.com/questions/20990550/how-to-make-sign-up-invitation-only
Accounts.validateNewUser((user) => {
  if (!user.invitationId) {
    throw new Meteor.Error(403, 'Invites are required to create an account');
  }

  // validate invitation
  const invitation = Invites.findOne({ _id: user.invitationId, used: false });
  if (!invitation) {
    throw new Meteor.Error(403, 'Please provide a valid invitation');
  }

  // prevent the token being re-used.
  Invites.update({ _id: user.invitationId, used: false }, { $set: { used: true } });

  return true;
});

Accounts.onCreateUser((options, user) => {
  // eslint-disable-next-line no-param-reassign
  user.invitationId = options.invitationId;
  return user;
});

Meteor.methods({
  // eslint-disable-next-line meteor/audit-argument-checks
  queryIA: (url) => {
    const queryResult = HTTP.get(`http://archive.org/wayback/available?url=${url}`);
    return queryResult;
  },
});
