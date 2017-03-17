/* global window */
/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';

import Invites from '../../../api/invites';
import EventPicker from '../../components/EventPicker';
import NotFound from '../../components/pages/NotFound';

function newToken() {
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line no-mixed-operators, no-bitwise
    const v = (c === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class NewInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      error: '',
      event: undefined,
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const token = newToken();
    Meteor.call('invites.insert', { token, used: false }, (err) => {
      if (err) {
        this.setState({
          error: err,
        });
      } else {
        this.setState({
          token,
          error: undefined,
          message: 'successfully created new invite',
        });
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleChangeEvent() {

  }

  render() {
    const { currentUser, admin } = this.props;
    const { message, error, token } = this.state;

    // don't admit to this route existing if not an admin
    if (!currentUser || !admin) {
      return <NotFound />;
    }

    if (token) {
      return (
        <div id="newInvite" className="new model page">
          <div className="container">
            <div className="row">
              <div className="col-8 offset-2">
                <h3>Send this link to the person you&apos;d like to invite:</h3>
                <h2>http://{window.location.host}/invites/{token}</h2>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="newInvite" className="new model page">
        <div className="container">
          <header className="header">
            <h1>New Invite ({this.props.invites})</h1>
            { message ? <p>{message}</p> : undefined }
            { error ? <p>{error}</p> : undefined }
          </header>
          <form className="form" onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Auto-Add user to Event</label>
                  <EventPicker value={this.state.event} onChange={this.handleChangeEvent.bind(this, 'event')} />
                </div>
                <div className="form-group">
                  <button className="btn btn-primary">Create Invite</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

NewInvite.propTypes = {
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
  invites: PropTypes.array,
};

NewInvite.defaultProps = {
};

export default createContainer(() => {
  Meteor.subscribe('invites');

  const user = Meteor.user();
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  return {
    admin,
    currentUser: user,
    invites: Invites.find({}).count(),
  };
}, NewInvite);
