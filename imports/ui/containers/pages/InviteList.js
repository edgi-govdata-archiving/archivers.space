/* eslint-disable react/forbid-prop-types */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';

import Analytics from '../../../libs/analytics';
import Events from '../../../api/events';

import TableItems from '../../components/TableItems';
import EventItem from '../../components/item/EventItem';

class InviteList extends React.Component {
  componentWillMount() {
    Analytics.page();
  }

  render() {
    const { events, currentUser, admin } = this.props;
    return (
      <div id="events" className="list page">
        <div className="container">
          <header className="header">
            {(currentUser && admin) ? <Link className="new" to="/events/new">Add An Event</Link> : undefined }
            <h1 className="title">Events</h1>
          </header>
          <table className="items table">
            <thead>
              <tr>
                <th>#</th>
                <th>name</th>
                <th>starts</th>
                <th>stops</th>
              </tr>
            </thead>
            <TableItems data={events} component={EventItem} />
          </table>
        </div>
      </div>
    );
  }
}

InviteList.propTypes = {
  events: PropTypes.array,
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
};

InviteList.defaultProps = {
  events: [],
  currentUser: undefined,
  admin: false,
};

export default createContainer(() => {
  Meteor.subscribe('events');

  const user = Meteor.user();
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  return {
    currentUser: user,
    admin,
    events: Events.find({}).fetch(),
  };
}, InviteList);
