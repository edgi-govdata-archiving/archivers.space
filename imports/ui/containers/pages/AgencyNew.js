/* eslint-disable react/jsx-no-bind, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';

import AgencyForm from '../../components/form/AgencyForm';
import NotFound from '../../components/pages/NotFound';

class NewAgency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  handleSubmit(data) {
    Meteor.call('agencies.insert', data, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({
          error: undefined,
          message: 'successfully created new agency',
        });
        browserHistory.push('/agencies');
      }
    });
  }

  render() {
    const { currentUser, admin } = this.props;

    // don't admit to this route existing if not an admin
    if (!currentUser || !admin) {
      return <NotFound />;
    }

    return (
      <div id="agency" className="new model page">
        <div className="container">
          <header className="header">
            <h1>New Agency</h1>
          </header>
          <AgencyForm onSubmit={this.handleSubmit.bind(this)} submitText="Create Agency" />
        </div>
      </div>
    );
  }
}

NewAgency.propTypes = {
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
};

NewAgency.defaultProps = {
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
}, NewAgency);
