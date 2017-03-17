/* eslint-disable react/jsx-no-bind, jsx-a11y/no-static-element-interactions, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import Agencies from '../../../api/agencies';
import AgencyForm from '../../components/form/AgencyForm';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

class Agency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  handleEdit() {
    this.setState({ editing: true });
  }

  handleCloseModal() {
    this.setState({ editing: false });
  }

  handleUpdate(update) {
    const id = update._id;
    // eslint-disable-next-line no-param-reassign
    delete update._id;
    Meteor.call('agencies.update', id, update, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({ editing: false, error: undefined });
      }
    });
  }

  handleDelete() {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to delete this agency? You probably don't want to delete this agency.")) {
      Meteor.call('agencies.remove', this.props.agency._id, (error) => {
        if (error) {
          this.setState({ error: error.message });
        } else {
          browserHistory.push('/events');
        }
      });
    }
  }

  renderModal() {
    if (this.state.editing !== true) {
      return undefined;
    }
    return (
      <Modal title={`Edit ${this.props.agency.acronym}`} onCancel={this.handleCloseModal.bind(this)}>
        <AgencyForm data={this.props.agency} submitText="Save" error={this.state.error} onSubmit={this.handleUpdate.bind(this)} />
      </Modal>
    );
  }

  render() {
    const { agency, currentUser, admin } = this.props;

    if (!agency) {
      return <Spinner />;
    }

    return (
      <div id="agency" className="model page">
        {this.renderModal()}
        <div className="container">
          <header className="header">
            <div className="actions">
              { (currentUser && admin) ? <a className="edit" onClick={this.handleEdit.bind(this)}>edit</a> : undefined }
              { (currentUser && admin) ? <a className="delete" onClick={this.handleDelete.bind(this)}>delete</a> : undefined }
            </div>
            <h1 className="title">{agency.name}</h1>
            <h3 className="subtitle">{agency.acronym}</h3>
          </header>
          <div>
            <p>{agency.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

Agency.propTypes = {
  agency: PropTypes.object,
  currentUser: PropTypes.object,
  admin: PropTypes.bool,
};

Agency.defaultProps = {
};

export default createContainer(({ params }) => {
  Meteor.subscribe('agencies');

  const user = Meteor.user();
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  return {
    admin,
    currentUser: user,
    agency: Agencies.findOne({ _id: params.id }),
  };
}, Agency);
