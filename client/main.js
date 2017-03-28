/* globals window */
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';

import '../imports/startup/accounts-config';
import Routes from '../imports/startup/client/routes';

Meteor.startup(() => {
  render(Routes, document.getElementById('app'));
});
