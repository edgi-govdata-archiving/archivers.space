import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Analytics from '../libs/analytics';

const Events = new Mongo.Collection('events');
export default Events;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('events', () => {
    const events = Events.find({});
    return events;
  });
}

function newEvent(props, userId) {
  return Object.assign({
    createdAt: new Date(),
    creator: userId,

    name: '',
    description: '',

    start: new Date(),
    stop: new Date(),

    attendees: [],

    offline: false,
    address: '',
    lat: 0,
    lng: 0,
  }, props);
}

Meteor.methods({
  'events.join': function eventJoin(eventId) {
    check(eventId, String);

    if (!this.userId) {
      throw new Meteor.Error('userId is required');
    }

    const event = Events.findOne({ _id: eventId });
    if (!event) {
      throw new Meteor.Error('unknown event');
    }

    const attendees = event.attendees || [];
    // eslint-disable-next-line no-undef
    if (attendees.find(id => id === userId)) {
      return;
    }

    attendees.push(this.userId);
    Analytics.track("Joined Event", event);
    Events.update(event._id, { $set: { attendees } });
  },

  'events.leave': function eventLeave(eventId) {
    check(eventId, String);

    if (!this.userId) {
      throw new Meteor.Error('userId is required');
    }
    const event = Events.findOne({ _id: eventId });
    if (!event) {
      throw new Meteor.Error('unknown event');
    }

    const attendees = event.attendees || [];
    // eslint-disable-next-line no-undef
    const i = attendees.findIndex(id => id === userId);
    if (i !== -1) {
      attendees.splice(i, 1);
    }
    Analytics.track("Left Event", event);
    Events.update(event._id, { $set: { attendees } });
  },

  'events.insert': function eventInsert(event) {
    check(event, Object);
    const exists = Events.findOne({ name: event.name });
    if (exists) {
      throw new Meteor.Error('event already exists');
    }

    // Make sure the user is logged in before inserting a task
    // @TODO - check for permissions
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Analytics.track("Inserted Event", event);
    Events.insert(newEvent(event, this.userId));
  },

  'events.update': function eventUpdate(eventId, changes) {
    check(eventId, String);
    check(changes, Object);

    const event = Events.findOne(eventId);
    if (event.locked && event.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    if (changes.event && changes.event !== event.event) {
      const exists = Events.findOne({ event: changes.event });
      if (exists) {
        throw new Meteor.Error('event already exists');
      }
    }

    Analytics.track("Updated Event", event);
    Events.update(event._id, { $set: changes });
  },

  'events.remove': function eventRemove(eventId) {
    check(eventId, String);

    const event = Events.findOne(eventId);
    if (event.private && event.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    Analytics.track("Removed Event", event);
    Events.remove(eventId);
  },
});
