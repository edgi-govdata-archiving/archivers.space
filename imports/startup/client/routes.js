import React from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import App from '../../ui/containers/layouts/App';
import Dashboard from '../../ui/containers/pages/Dashboard';
import Login from '../../ui/containers/pages/Login';

import UserEdit from '../../ui/containers/pages/UserEdit';
import UserList from '../../ui/containers/pages/UserList';
import UserSettings from '../../ui/containers/pages/UserSettings';

import InviteEdit from '../../ui/containers/pages/InviteEdit';
import InviteNew from '../../ui/containers/pages/InviteNew';
import InviteList from '../../ui/containers/pages/InviteList';

import UrlEdit from '../../ui/containers/pages/UrlEdit';
import UrlNew from '../../ui/containers/pages/UrlNew';
import UrlList from '../../ui/containers/pages/UrlList';
import UploadToken from '../../ui/containers/pages/UploadToken';

import EventEdit from '../../ui/containers/pages/EventEdit';
import EventNew from '../../ui/containers/pages/EventNew';
import EventList from '../../ui/containers/pages/EventList';

import AgencyEdit from '../../ui/containers/pages/AgencyEdit';
import AgencyNew from '../../ui/containers/pages/AgencyNew';
import AgencyList from '../../ui/containers/pages/AgencyList';

import NotFound from '../../ui/components/pages/NotFound';

const Routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />

      <Route path="/login" component={Login} />

      <Route path="/urls" component={UrlList} />
      <Route path="/urls/new" component={UrlNew} />
      <Route path="/urls/:uuid" component={UrlEdit} />
      <Route path="/urls/:uuid/upload" component={UploadToken} />

      <Route path="/events" component={EventList} />
      <Route path="/events/new" component={EventNew} />
      <Route path="/events/:id" component={EventEdit} />

      <Route path="/agencies" component={AgencyList} />
      <Route path="/agencies/new" component={AgencyNew} />
      <Route path="/agencies/:id" component={AgencyEdit} />

      <Route path="/users" component={UserList} />
      <Route path="/users/:username" component={UserEdit} />

      <Route path="/invites" component={InviteList} />
      <Route path="/invites/new" component={InviteNew} />
      <Route path="/invites/:token" component={InviteEdit} />

      <Route path="/settings" component={UserSettings} />

      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;
