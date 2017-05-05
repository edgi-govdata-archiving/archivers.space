/* eslint-disable meteor/no-session, no-console, no-alert, react/prop-types, react/jsx-no-bind, jsx-a11y/no-static-element-interactions, jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import Events from '../../../api/events';
import Urls from '../../../api/urls';

import EventForm from '../../components/form/EventForm';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import TableItems from '../../components/TableItems';
import UrlItem from '../../components/item/UrlItem';
import UrlSearch from '../../components/UrlSearch';


import Analytics from '../../../libs/analytics';


class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  componentWillMount() {
    Analytics.page();
  }

  handleEdit() {
    this.setState({ modal: 'edit' });
  }

  handleShowAddUrl() {
    this.setState({ modal: 'addUrl' });
  }

  handleShowRemoveUrl() {
    this.setState({ modal: 'removeUrl' });
  }

  handleCloseModal() {
    this.setState({ modal: '' });
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

  handleEventAddUrl(url) {
    Meteor.call('urls.setEvent', this.props.event._id, url._id, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({ modal: '', error: undefined });
      }
    });
  }

  handleRemoveUrl(url) {
    Meteor.call('urls.removeEvent', url._id, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({ modal: '', error: undefined });
      }
    });
  }

  renderModal() {
    if (!this.state.modal) {
      return undefined;
    }
    switch (this.state.modal) {
      case 'edit':
        return (
          <Modal title={`Edit ${this.props.event.name}`} onCancel={this.handleCloseModal.bind(this)}>
            <EventForm data={this.props.event} submitText="Save" error={this.state.error} onSubmit={this.handleUpdate.bind(this)} />
          </Modal>
        );

      case 'addUrl':
        return (
          <Modal title={`Edit ${this.props.event.name}`} onCancel={this.handleCloseModal.bind(this)}>
            <h4>Add Event Url</h4>
            <UrlSearch onSelect={this.handleEventAddUrl.bind(this)} />
          </Modal>
        );
      case 'removeUrl':
        return (
          <Modal title={`Edit ${this.props.event.name}`} onCancel={this.handleCloseModal.bind(this)}>
            <h4>Remove Event Url</h4>
            <div className="results">
              {this.props.urls.map((r) => {
                const result = (
                  <div key={r.uuid} className="result">
                    <a className="primary" onClick={this.handleRemoveUrl.bind(this, r)}>{r.uuid}</a>
                    <p>{r.url}</p>
                  </div>
                );
                return result;
              })}
            </div>
          </Modal>
        );
      default:
        return null;
    }
  }

  renderAttendance() {
    const { attending } = this.props;
    return (
      <div>
        <button className={attending ? 'btn btn-warning' : 'btn btn-primary'} onClick={this.handleToggleAttendance.bind(this)}>{attending ? 'Leave' : 'Join'}</button>
      </div>
    );
  }

  renderUrls() {
    const { urls, currentUser, admin } = this.props;
    return (
      <div>
        <hr />
        <div className="header">
          <div className="actions">
            { (currentUser && admin) && <a className="edit" onClick={this.handleShowAddUrl.bind(this)}>add</a> }
            { (currentUser && admin) && <a className="delete" onClick={this.handleShowRemoveUrl.bind(this)}>remove</a> }
          </div>
          <h4 className="title">Urls</h4>
          <div className="description">
            <i>Primary urls to focus on for this event:</i>
          </div>
        </div>
        {(urls.length > 0) &&
          <table className="items table table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>!</th>
                <th>uuid</th>
                <th>url</th>
                <th>user</th>
              </tr>
            </thead>
            <TableItems data={urls} component={UrlItem} />
          </table>
        }
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
              { (currentUser && admin) && <a className="edit" onClick={this.handleEdit.bind(this)}>edit</a> }
              { (currentUser && admin) && <a className="delete" onClick={this.handleDelete.bind(this)}>delete</a> }
            </div>
            <h1 className="title">{event.name}</h1>
            <p>{event.attendees.length} {(event.attendees.length === 1) ? 'Attendee' : 'Attendees'}</p>
          </header>
          <p>{event.description}</p>
          {this.renderAttendance()}
          {this.renderUrls()}
        </div>
      </div>
    );
  }
}

export default createContainer(({ params }) => {
  Meteor.subscribe('events');
  Meteor.subscribe('urls.forEvent', params.id);

  const user = Meteor.user();
  const event = Events.findOne({ _id: params.id });
  const urls = Urls.find({ event_id: params.id }).fetch();
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
    urls,
  };
}, Event);
