/* eslint-disable react/forbid-prop-types, react/prop-types, react/jsx-no-bind, jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import Events from '../../../api/events';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import EventForm from '../../components/form/EventForm';

class Event extends React.Component {
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
    Meteor.call('events.update', id, update, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({ editing: false, error: undefined });
      }
    });
  }

  handleDelete() {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to delete this event? You probably don't want to delete this event.")) {
      Meteor.call('events.remove', this.props.event._id, (error) => {
        if (error) {
          this.setState({ error: error.message });
        } else {
          browserHistory.push('/events');
        }
      });
    }
  }

  handleToggleAttendance() {
    if (!this.props.attending) {
      Meteor.call('events.join', this.props.event._id, this.props.currentUser._id);
    } else {
      Meteor.call('events.leave', this.props.event._id, this.props.currentUser._id);
    }
  }

  renderModal() {
    if (this.state.editing !== true) {
      return undefined;
    }
    return (
      <Modal title={`Edit ${this.props.event.name}`} onCancel={this.handleCloseModal.bind(this)}>
        <EventForm data={this.props.event} submitText="Save" error={this.state.error} onSubmit={this.handleUpdate.bind(this)} />
      </Modal>
    );
  }

  renderAttendance() {
    const { attending } = this.props;
    return (
      <div>
        <button className={attending ? 'btn btn-warning' : 'btn btn-primary'} onClick={this.handleToggleAttendance.bind(this)}>{attending ? 'Leave' : 'Join'}</button>
      </div>
    );
  }

  render() {
    const { event, currentUser, admin } = this.props;

    if (!event) {
      return (<Spinner />);
    }

    return (
      <div id="event" className="model page">
        {this.renderModal()}
        <div className="container">
          <header className="header">
            <div className="actions">
              { (currentUser && admin) ? <a className="edit" onClick={this.handleEdit.bind(this)}>edit</a> : undefined }
              { (currentUser && admin) ? <a className="delete" onClick={this.handleDelete.bind(this)}>delete</a> : undefined }
            </div>
            <h1 className="title">{event.name}</h1>
            <p>{event.attendees.length} {(event.attendees.length === 1) ? 'Attendee' : 'Attendees'}</p>
          </header>
          <p>{event.description}</p>
          {this.renderAttendance()}
        </div>
      </div>
    );
  }
}

export default createContainer(({ params }) => {
  Meteor.subscribe('events');

  const user = Meteor.user();
  const event = Events.findOne({ _id: params.id });
  let attending = false;
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  if (user && event) {
    attending = event.attendees.includes(user._id);
  }

  return {
    admin,
    currentUser: user,
    event,
    attending,
  };
}, Event);
