/* eslint-disable meteor/no-session, react/prop-types, react/jsx-no-bind, jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { newUrl } from '../../../api/urls';
import Events from '../../../api/events';
import Agencies from '../../../api/agencies';

import NotFound from '../../components/pages/NotFound';

class NewUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: undefined,
      error: undefined,
      data: newUrl({}),
    };
  }

  handleChange(name, e) {
    const change = Object.assign({}, this.state.data, {
      [name]: e.target.value,
    });
    this.setState({ data: change });
  }

  handleAgencyChange(e) {
    const id = e.target.value;
    const agency = this.props.agencies.find(a => (a._id === id));
    const data = Object.assign({}, this.state.data, {
      agency: '',
      agency_name: '',
      agency_acronym: '',
    });

    if (agency) {
      data.agency = agency._id;
      data.agency_name = agency.name;
      data.agency_acronym = agency.acronym;
    }

    this.setState({ data });
  }

  handleEventChange(e) {
    const id = e.target.value;
    const event = this.props.events.find(evt => (evt._id === id));
    const data = Object.assign({}, this.state.data, {
      event: '',
      event_name: '',
    });

    if (event) {
      data.event = event._id;
      data.event_name = event.name;
    }

    this.setState({ data });
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    Meteor.call('urls.bulkInsert', {
      urls: this.state.data.urls,
      props: Object.assign({}, this.state.data, { urls: undefined }),
    }, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({
          message: 'successfully added urls',
          error: undefined,
          data: {
            event: '',
            event_name: '',
            agency: '',
            agency_program_name: '',
            subagency_id: '',
            org_id: '',
            suborg_id: '',
            subprimer_id: '',
            seed_notes: '',
            seeded: '',
            urls: '',
          },
        });
        browserHistory.push('/urls');
        Session.set('messages.success', 'url updated');
        setTimeout(() => {
          Session.set('messages.success', '');
        }, 3500);
      }
    });
  }

  render() {
    const { currentUser } = this.props;
    const url = this.state.data;

    // don't admit to this route existing if not logged-in
    if (!currentUser) {
      return <NotFound />;
    }

    return (
      <div id="newUrl" className="new model page">
        <div className="container">
          <header className="header">
            <h3 className="title">Add Url(s):</h3>
            <p className="has-success">{this.state.message}</p>
            <p className="has-danger">{this.state.error}</p>
          </header>
          <form className="new-url" onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">
              <div className="form-group col-12">
                <label>any notes to help?</label>
                <textarea className="form-control" value={url.seed_notes} onChange={this.handleChange.bind(this, 'seed_notes')} placeholder="" />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-12">
                <label>url to add</label>
                <input className="form-control" type="text" value={url.urls} onChange={this.handleChange.bind(this, 'urls')} placeholder="" />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <input className="btn btn-primary btn-large" type="submit" value="add url(s)" />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

NewUrl.propTypes = {
  agencies: PropTypes.array,
  events: PropTypes.array,
};

NewUrl.defaultProps = {
};

export default createContainer(() => {
  Meteor.subscribe('events');
  Meteor.subscribe('agencies');

  return {
    currentUser: Meteor.user(),
    events: Events.find({}).fetch(),
    agencies: Agencies.find({}).fetch(),
  };
}, NewUrl);
