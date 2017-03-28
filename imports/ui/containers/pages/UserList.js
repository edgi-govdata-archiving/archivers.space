/* eslint-disable react/forbid-prop-types */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';

import TableItems from '../../components/TableItems';
import UserItem from '../../components/item/UserItem';
import Analytics from '../../../libs/analytics';

class UserList extends React.Component {
  componentWillMount() {
    Analytics.page();
  }

  render() {
    const { users, currentUser, admin } = this.props;

    return (
      <div id="events" className="list page">
        <div className="container">
          <header className="header">
            <div className="actions">
              {(currentUser && admin) ? <Link className="new" to="/invites/new">Invite User</Link> : undefined }
            </div>
            <h1 className="title">Users</h1>
          </header>
          <table className="items table">
            <thead>
              <tr>
                <th>#</th>
                <th>username</th>
              </tr>
            </thead>
            <TableItems data={users} component={UserItem} />
          </table>
        </div>
      </div>
    );
  }
}

UserList.propTypes = {
  users: PropTypes.array,
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
};

UserList.defaultProps = {
  users: [],
  currentUser: undefined,
  admin: false,
};

export default createContainer(() => {
  Meteor.subscribe('userList');

  const user = Meteor.user();
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  return {
    admin,
    currentUser: user,
    users: Meteor.users.find().fetch(),
  };
}, UserList);
