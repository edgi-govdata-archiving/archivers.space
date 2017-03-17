/* eslint-disable meteor/no-session, no-console, react/jsx-no-bind, jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Spinner from '../../components/Spinner';

class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      error: '',

      username: '',

      oldPass: '',
      newPass: '',
      repeatPass: '',
    };
  }
  handleChange(name, e) {
    this.setState(Object.assign({}, this.state, { [name]: e.target.value }));
  }
  handleChangeUsername(e) {
    e.preventDefault();
    Meteor.call('users.setUsername', this.props.user._id, this.state.username, (err) => {
      if (err) {
        this.setState({ error: err.error });
        return;
      }

      Session.set('messages.success', 'username changed');
      setTimeout(() => {
        Session.set('messages.success', '');
      }, 3500);
    });
  }
  handleChangePassword(e) {
    e.preventDefault();
    console.log(this.state.oldPass);
    Accounts.changePassword(this.state.oldPass, this.state.newPass, (err) => {
      if (err) {
        this.setState({ error: err.message });
        return;
      }

      Session.set('messages.success', 'password changed');
      setTimeout(() => {
        Session.set('messages.success', '');
      }, 3500);
    });
  }

  render() {
    const { user } = this.props;

    if (!user) {
      return <Spinner />;
    }

    return (
      <div id="user" className="model page">
        <div className="container">
          <header className="header">
            <h1 className="title">{user.username} Settings</h1>
            <p className="error">{this.state.error}</p>
            <p className="message">{this.state.message}</p>
          </header>
          <section>
            <form className="" onSubmit={this.handleChangeUsername.bind(this)}>
              <h3>Change Your Username:</h3>
              <div className="form-group">
                <label>New Username:</label>
                <input className="form-control" type="text" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} />
              </div>
              <input className="btn btn-primary" type="submit" value="Change Username" />
            </form>
            <hr />
            <form className="" onSubmit={this.handleChangePassword.bind(this)}>
              <h3>Change Your Password</h3>
              <div className="form-group">
                <label>current password:</label>
                <input className="form-control" type="password" value={this.state.oldPass} onChange={this.handleChange.bind(this, 'oldPass')} />
              </div>
              <div className="form-group">
                <label>new password:</label>
                <input className="form-control" type="password" value={this.state.newPass} onChange={this.handleChange.bind(this, 'newPass')} />
              </div>
              <div className="form-group">
                <label>repeat new password:</label>
                <input className="form-control" type="password" value={this.state.repeatPass} onChange={this.handleChange.bind(this, 'repeatPass')} />
              </div>
              <input className="btn btn-primary" type="submit" value="Change Password" />
            </form>
          </section>
        </div>
      </div>
    );
  }
}

UserSettings.propTypes = {
  user: PropTypes.object,
};

UserSettings.defaultProps = {
};

export default createContainer(() => {
  Meteor.subscribe('userList');

  const user = Meteor.user();
  let roles = {};
  if (user) {
    roles = {
      admin: Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP),
    };
  }

  return {
    user,
    roles,
  };
}, UserSettings);
