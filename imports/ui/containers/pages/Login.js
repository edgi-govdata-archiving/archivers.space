/* eslint-disable react/jsx-no-bind, jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Spinner from '../../components/Spinner';
import Analytics from '../../../libs/analytics';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      username: '',
      password: '',
    };
  }

  componentWillMount() {
    Analytics.page();
  }

  handleSubmit(e) {
    e.preventDefault();

    Meteor.loginWithPassword(this.state.username, this.state.password, (err) => {
      if (err) {
        this.setState({ error: err.message });
      } else {
        browserHistory.push(`/users/${Meteor.user().username}`);
      }
    });
  }

  handleChange(name, e) {
    this.setState({ [name]: e.target.value });
  }

  render() {
    const { currentUser } = this.props;
    const { username, password, error } = this.state;

    // If a user is logged in, they shouldn't be looking at an invite
    if (currentUser) {
      browserHistory.push(`/users/${currentUser.username}`);
      return <Spinner />;
    }

    return (
      <div id="login" className="model page">
        <div className="container">
          <div className="col-6 offset-3">
            <form className="form" onSubmit={this.handleSubmit.bind(this)}>
              <h1 className="title">Login</h1>
              <p className="has-error">{error}</p>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={username} onChange={this.handleChange.bind(this, 'username')} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={this.handleChange.bind(this, 'password')} />
              </div>
              <input type="submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  currentUser: PropTypes.object,
};

Login.defaultProps = {
};

export default createContainer(() => {
  const container = {
    currentUser: Meteor.user(),
  };
  return container;
}, Login);
