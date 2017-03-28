/* eslint-disable react/forbid-prop-types */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';

import Agencies from '../../../api/agencies';
import Analytics from '../../../libs/analytics';

import TableItems from '../../components/TableItems';
import AgencyItem from '../../components/item/AgencyItem';

class AgencyList extends React.Component {
  componentWillMount() {
    Analytics.page();
  }

  render() {
    const { agencies, currentUser, admin } = this.props;
    return (
      <div id="agencies" className="list page">
        <div className="container">
          <header className="header">
            {(currentUser && admin) ? <Link className="new" to="/agencies/new">New Agency</Link> : undefined }
            <h1 className="title">Agencies</h1>
          </header>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>acronym</th>
                <th>name</th>
              </tr>
            </thead>
            <TableItems data={agencies} component={AgencyItem} />
          </table>
        </div>
      </div>
    );
  }
}

AgencyList.propTypes = {
  agencies: PropTypes.array,
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
};

AgencyList.defaultProps = {
  agencies: [],
  currentUser: undefined,
  admin: false,
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
    agencies: Agencies.find().fetch(),
  };
}, AgencyList);
