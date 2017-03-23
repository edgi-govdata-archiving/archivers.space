import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
// import Alerts from '../../components/Alerts';

// App component - represents the whole app
// eslint-disable-next-line react/prop-types
const App = ({ currentUser, success, error, children }) => {
  const app = (
    <div className="l-wrap">
      <div className="l-messages">
        { success ? <div className="success notification">{success}</div> : <div className="success notification hidden">{success}</div>}
        { error ? <div className="error notification">{error}</div> : <div className="error notification hidden">{error}</div>}
      </div>
      <nav className="l-navbar">
        <Link className="navbar__brand" to="/">ARCHIVERS</Link>
        <div className="navbar__links">
          { currentUser ? <Link to={`/users/${currentUser.username}`}>{currentUser.username}</Link> : <Link to="/login">Login</Link> }
          { currentUser ? <Link to="/urls">Urls</Link> : undefined }
          { currentUser ? <Link to="/agencies">Agencies</Link> : undefined }
          <Link to="/events">Events</Link>
          { currentUser ? <Link to="/users">Users</Link> : undefined }
          { currentUser ? <a href="https://datarefuge.github.io/workflow/faq/" target="_blank" rel="noopener noreferrer">FAQ</a> : undefined }
        </div>
      </nav>
      <div className="l-alerts">
        { /**
        <Alerts />
           **/ }
      </div>
      <div className="l-page">
        {children}
      </div>
    </div>
  );
  return app;
};

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentUser: PropTypes.object,
};

export default createContainer(({ params }) => {
  const container = {
    component: params.component,
    currentUser: Meteor.user(),
    // eslint-disable-next-line meteor/no-session
    success: Session.get('messages.success'),
    // eslint-disable-next-line meteor/no-session
    error: Session.get('messages.error'),
  };
  return container;
}, App);
