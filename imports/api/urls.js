import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { phaseSelector, lockIsStale } from '../selectors/url';
import LockHistory from './lock_history';
import Analytics from '../libs/analytics';

const normalizeUrl = require('../libs/normalize-url');

// um, yeah, tell no one.
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line one-var, one-var-declaration-per-line, no-mixed-operators, no-bitwise
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

const Urls = new Mongo.Collection('urls');
export default Urls;

if (Meteor.isServer) {
  Meteor.publish('urls', () => {
    const urls = Urls.find({});
    return urls;
  });

  Meteor.publish('urls.forEvent', (eventId) => {
    check(eventId, String);
    const urls = Urls.find({ event_id: eventId }, {
      sort: [['priority', 'desc']],
    });
    return urls;
  });

  const phases = [
    'research',
    'harvest',
    'bag',
    'describe',
    'done',
    'crawlable',
  ];

  phases.map((phase) => {
    // eslint-disable-next-line meteor/audit-argument-checks
    Meteor.publish(`urls.${phase}`, (limit) => {
      const urls = Urls.find(phaseSelector(phase), {
        limit,
        sort: [['priority', 'desc']],
      });
      return urls;
    });
    return true;
  });
}

export function newUrl(props, userId) {
  return Object.assign({
    uuid: uuid(),
    createdAt: new Date(),
    creator: userId,

    // research
    significance: '',
    recommended_approach: '',
    file_types: '',
    estimated_size: '',  // being loose here to allow comments
    research_done: false,
    crawlable: false,
    has_dynamic_content: false,
    has_vis: false,
    is_ftp: false,
    has_api: false,
    has_direct_download: false,
    has_form: false,

    // harvest
    harvest_done: false,

    // bag
    warc_made: false,
    packaged: false,

    // package_size: 0,
    uploaded: false,
    spot_checked: false,
    bag_done: false,
    describe_done: false,

    // finalize
    done: false,
    s3_url: '',
    ckan_url: '',
    finished: false,
  }, props);
}

Meteor.methods({
  'urls.bulkInsert': function urlBulkInsert({ props, urls }) {
    const errors = [];
    urls.split('\n').forEach((url) => {
      // eslint-disable-next-line no-param-reassign
      url = normalizeUrl(url.trim());
      const exists = Urls.findOne({ url });
      if (exists) {
        errors.push(`url already exists: ${url}`);
      } else {
        Urls.insert(newUrl(Object.assign({ url }, props), this.userId));
      }
    });

    if (errors.length) {
      throw new Meteor.Error(errors.join('\n'));
    }
    Analytics.track('Inserted Urls', urls);
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.insert': function urlInsert(url) {
    check(url.url, String);
    check(url.agency, String);
    check(url.seeded, Boolean);
    check(url.seed_notes, String);

    // eslint-disable-next-line no-param-reassign
    url.url = normalizeUrl(url.url.trim());

    const exists = Urls.findOne({ url: url.url });
    if (exists) {
      throw new Meteor.Error('url already exists');
    }

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Analytics.track('Inserted Url', url);
    Urls.insert(newUrl(url, this.userId));
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.setPriority': function urlSetPriority(urlId, priority) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Urls.update(urlId, { $set: { priority } });
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.update': function urlUpdate(urlId, changes) {
    if (!Object.keys(changes).length) {
      throw new Meteor.Error('no changes to save');
    }

    const url = Urls.findOne(urlId);
    if (url.locked && url.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    if (changes.url && changes.url !== url.url) {
      const exists = Urls.findOne({ url: changes.url });
      if (exists) {
        throw new Meteor.Error('url already exists');
      }
    }

    Analytics.track('Updated Url', url);
    Urls.update(url._id, { $set: changes });
  },

  'urls.remove': function urlRemove(urlId) {
    check(urlId, String);

    if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }

    Analytics.track('Removed Url', urlId);
    Urls.remove(urlId);
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.lock': function urlLock(urlId) {
    const url = Urls.findOne(urlId);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const user = Meteor.user();
    const prev = Urls.findOne({ locked: this.userId });
    if (prev) {
      Urls.update(prev._id, { $set: {
        locked: undefined,
        lock_username: undefined,
        lock_time: undefined,
      } });
    }

    Analytics.track('Locked Url', { urlId });
    Urls.update(urlId, { $set: {
      locked: this.userId,
      lock_username: user.username,
      lock_time: new Date(),
    } });
    Meteor.users.update(this.userId, { $set: { lock_url_uuid: url.uuid } });
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.unlock': function urlUnlock(urlId) {
    const url = Urls.findOne(urlId);

    if ((url.locked && url.locked === this.userId) || (url.locked && Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP) && lockIsStale(url))) {
      // Add a record of this lock/unlock cycle to lock_history.
      LockHistory.insert({
        url: urlId,
        user: url.locked,
        locked_at: url.lock_time,
        unlocked_at: new Date(),
      });

      Analytics.track('Unlocked Url', { urlId });
      // Remove the lock.
      Urls.update(urlId, { $set: {
        locked: undefined,
        lock_username: undefined,
        lock_time: undefined,
      } });

      Meteor.users.update(url.locked, { $set: { lock_url_uuid: undefined } });
    } else {
      throw new Meteor.Error('not-authorized');
    }
  },

  'urls.setEvent': function setEvent(eventId, urlId) {
    check(urlId, String);
    check(eventId, String);
    const url = Urls.findOne(urlId);
    if (!url) {
      throw new Meteor.Error('not found');
    }
    if (!Roles.userIsInRole(this.userId, 'admin', Roles.GLOBAL_GROUP)) {
      throw new Meteor.Error('not-authorized');
    }

    Analytics.track('Event AddedUrl', { eventId, urlId });
    Urls.update(urlId, {
      $set: { event_id: eventId },
    });
  },

  'urls.removeEvent': function removeEvent(urlId) {
    check(urlId, String);

    Analytics.track('Event RemovedUrl', { urlId });
    Urls.update(urlId, {
      $set: { event_id: undefined },
    });
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.merge': function urlMerge(urlId, targetUrlId) {
    const url = Urls.findOne(urlId);
    if (url.locked !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    const target = Urls.findOne(targetUrlId);

    Urls.update(urlId, { $set: {
      merged: targetUrlId,
      merged_uuid: target.uuid,
    } });
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'urls.unmerge': function urlUnmerge(urlId) {
    Urls.update(urlId, { $set: { merged: undefined, merged_uuid: false } });
  },

  'urls.setPrivate': function urlSetPrivate(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Urls.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Urls.update(taskId, { $set: { private: setToPrivate } });
    // @todo where is Users coming from?
    // eslint-disable-next-line no-undef
    Users.update(this.userId, { $set: { lock_url: urlId } });
  },
});
