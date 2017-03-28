import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Analytics from '../libs/analytics';

const Agencies = new Mongo.Collection('agencies');
export default Agencies;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('agencies', (limit = 20) => {
    check(limit, Number);

    const agencies = Agencies.find({}, { limit });
    return agencies;
  });
}

function newAgency(props, userId) {
  return Object.assign({
    createdAt: new Date(),
    creator: userId,

    name: '',
    acronym: '',
    agency_id: '',
    subagency_id: '',
    urls: [],
  }, props);
}

Meteor.methods({
  'agencies.insert': function agencyInsert(agency) {
    check(agency, Object);
    check(agency.name, String);

    const exists = Agencies.findOne({ name: agency.name });
    if (exists) {
      throw new Meteor.Error('agency already exists');
    }

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Analytics.track("Inserted Agency", agency);
    Agencies.insert(newAgency(agency, this.userId));
  },

  'agencies.update': function agencyUpdate(agencyId, changes) {
    check(agencyId, String);
    check(changes, Object);

    const agency = Agencies.findOne(agencyId);

    if (changes.agency && changes.agency !== agency.agency) {
      const exists = Agencies.findOne({ agency: changes.agency });
      if (exists) {
        throw new Meteor.Error('agency already exists');
      }
    }

    Analytics.track("Updated Agency", agency);
    Agencies.update(agency._id, { $set: changes });
  },

  'agencies.remove': function agencyRemove(agencyId) {
    check(agencyId, String);

    const agency = Agencies.findOne(agencyId);
    if (agency.private && agency.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Analytics.track("Removed Agency", agency);
    Agencies.remove(agencyId);
  },
});
