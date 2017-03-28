import { Meteor } from 'meteor/meteor';

let analytics = [];

if (Meteor.isClient) {
  analytics = window.analytics;
} else {
  // falsify analytics on the server so calls don't explode things
  analytics.methods = [
    'trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset',
    'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on',
  ];
  analytics.factory = function factory (t) {
    return function makeFunc() {
      // this makes server-side analytics calls a noop
      return analytics;
    };
  };

  for (let t=0; t < analytics.methods.length; t++){
    const e = analytics.methods[t];
    analytics[e] = analytics.factory(e);
  }

  analytics.load = (t) => {};
  analytics.SNIPPET_VERSION = '4.0.0';
}

export default analytics;
