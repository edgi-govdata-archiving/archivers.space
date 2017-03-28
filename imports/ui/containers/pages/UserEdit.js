/* eslint-disable react/jsx-no-bind, jsx-a11y/no-static-element-interactions, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import Analytics from '../../../libs/analytics';
import Spinner from '../../components/Spinner';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    Analytics.page();
  }

  // eslint-disable-next-line no-unused-vars
  componentWillReceiveProps(nextProps) {
    // if (nextProps.currentUser && !this.state.uningestedRows) {
    //   // const currentUser = nextProps.currentuser;
    //   Meteor.call('spreadsheetIngests.countNewRows', {}, (error, response) => {
    //     if (error) {
    //       console.log('Counting uningested spreadsheet rows failed.', error);
    //     } else {
    //       this.setState({ uningestedRows: response });
    //     }
    //   });
    // }
  }

  handleToggleUserAdmin() {
    if (this.props.userRoles.admin) {
      Meteor.call('users.removeAdmin', this.props.user._id);
    } else {
      Meteor.call('users.makeAdmin', this.props.user._id);
    }
  }
  handleToggleUserBagger() {
    if (this.props.userRoles.bagger) {
      Meteor.call('users.removeBagger', this.props.user._id);
    } else {
      Meteor.call('users.makeBagger', this.props.user._id);
    }
  }
  handleToggleUserChecker() {
    if (this.props.userRoles.checker) {
      Meteor.call('users.removeChecker', this.props.user._id);
    } else {
      Meteor.call('users.makeChecker', this.props.user._id);
    }
  }
  handleToggleUserDescriber() {
    if (this.props.userRoles.describer) {
      Meteor.call('users.removeDescriber', this.props.user._id);
    } else {
      Meteor.call('users.makeDescriber', this.props.user._id);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleLogout() {
    Meteor.logout(() => {
      browserHistory.push('/');
    });
  }

  handleIngestRequest() {
    if (this.props.userRoles.admin) {
      Meteor.call('spreadsheetIngests.ingest');
    }
  }

  renderActions() {
    const { currentUser, currentUserRoles, user, userRoles } = this.props;

    if (currentUser._id === user._id) {
      return (
        <div className="actions">
          <Link to="/settings">Settings</Link>
          <a onClick={this.handleLogout.bind(this)}>Logout</a>
        </div>
      );
    }

    return (
      <div className="actions">
        {currentUserRoles.root ? <a className="link" onClick={this.handleToggleUserAdmin.bind(this)}>{userRoles.admin ? 'remove admin' : 'make admin'}</a> : undefined }
        {currentUserRoles.admin ? <a className="link" onClick={this.handleToggleUserBagger.bind(this)}>{userRoles.bagger ? 'remove bagger' : 'make bagger'}</a> : undefined }
        {currentUserRoles.admin ? <a className="link" onClick={this.handleToggleUserChecker.bind(this)}>{userRoles.checker ? 'remove checker' : 'make checker'}</a> : undefined }
        {currentUserRoles.admin ? <a className="link" onClick={this.handleToggleUserDescriber.bind(this)}>{userRoles.describer ? 'remove describer' : 'make describer'}</a> : undefined }
      </div>
    );
  }

  renderAdminTasks() {
    const { currentUserRoles } = this.props;
    let text = (<div>Counting uningested rows from Google spreadsheet....</div>);
    if (this.state.uningestedRows) {
      text = (<div>There are {this.state.uningestedRows} uningested rows. <a className="link" onClick={this.handleIngestRequest.bind(this)}>Ingest Now</a></div>);
    }

    if (currentUserRoles.root) {
      return <div className="adminTasks">{text}</div>;
    }

    return <div className="adminTasks" />;
  }

  render() {
    const { user, userRoles } = this.props;

    if (!user) {
      return <Spinner />;
    }

    return (
      <div id="user" className="model page">
        <div className="container">
          <header className="header">
            {this.renderActions()}
            <h1 className="title">{user.username}</h1>
            {userRoles.admin ? <b>admin</b> : undefined}
          </header>
          {/* this.renderAdminTasks() */}
          <div>
            <div className="row">
              <div className="col">
                <hr />
                { user.lock_url_uuid ? <span>Currently Editing: <Link to={`/urls/${user.lock_url_uuid}`}>{user.lock_url_uuid}</Link></span> : undefined }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.object,
  userRoles: PropTypes.object,
  currentUser: PropTypes.object,
  currentUserRoles: PropTypes.object,
};

User.defaultProps = {
};

export default createContainer(({ params }) => {
  Meteor.subscribe('userList');

  const currentUser = Meteor.user();
  let currentUserRoles = {};

  if (currentUser) {
    currentUserRoles = {
      root: Roles.userIsInRole(currentUser._id, 'root', Roles.GLOBAL_GROUP),
      admin: Roles.userIsInRole(currentUser._id, 'admin', Roles.GLOBAL_GROUP),
    };
  }

  const user = Meteor.users.findOne({ username: params.username });
  let userRoles = {};
  if (user) {
    userRoles = {
      root: Roles.userIsInRole(user._id, 'root', Roles.GLOBAL_GROUP),
      admin: Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP),
      bagger: Roles.userIsInRole(user._id, 'bagger', Roles.GLOBAL_GROUP),
      checker: Roles.userIsInRole(user._id, 'checker', Roles.GLOBAL_GROUP),
      describer: Roles.userIsInRole(user._id, 'describer', Roles.GLOBAL_GROUP),
    };
  }

  return {
    currentUser,
    currentUserRoles,
    user,
    userRoles,
  };
}, User);
