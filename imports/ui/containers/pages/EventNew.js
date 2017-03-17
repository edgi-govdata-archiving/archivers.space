/* eslint-disable react/jsx-no-bind, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';

import EventForm from '../../components/form/EventForm';
import NotFound from '../../components/pages/NotFound';

class NewEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      error: '',
    };
  }

  handleSubmit(data) {
    Meteor.call('events.insert', data, (err) => {
      if (err) {
        this.setState({
          error: err.error,
        });
      } else {
        this.setState({
          error: undefined,
          message: 'successfully created new event',
        });
        browserHistory.push('/events');
      }
    });
  }

  render() {
    const { currentUser, admin } = this.props;
    const { message, error } = this.state;

    // don't admit to this route existing if not an admin
    if (!currentUser || !admin) {
      return <NotFound />;
    }

    return (
      <div id="newEvent" className="new model page">
        <div className="container">
          <header className="header">
            <h1>New Event</h1>
            { message ? <p>{message}</p> : undefined }
            { error ? <p>{error}</p> : undefined }
          </header>
          <EventForm onSubmit={this.handleSubmit.bind(this)} submitText="Create Event" />
        </div>
      </div>
    );
  }
}

NewEvent.propTypes = {
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
};

NewEvent.defaultProps = {
};

export default createContainer(() => {
  Meteor.subscribe('agencies');
  const user = Meteor.user();
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }


  return {
    admin,
    currentUser: user,
  };
}, NewEvent);
