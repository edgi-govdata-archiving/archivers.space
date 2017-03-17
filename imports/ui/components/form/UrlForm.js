/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { newUrl } from '../../../api/urls';

require('react-datepicker/dist/react-datepicker.css');

export default class UrlInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: newUrl(props.data, Meteor.user),
    };
  }

  handleChange(name, e) {
    const data = Object.assign({}, this.state.data, { [name]: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(name, e.target.value, e);
    }
    this.setState({ data });
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
    const event = this.props.events.find(() => e._id === id);
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

  handleSubmit(e) {
    e.preventDefault();

    this.props.onSubmit(this.state.data, e);
  }

  render() {
    const url = this.state.data;

    return (
      <form className="new-url" onSubmit={this.handleSubmit.bind(this)}>
        <div className="row">
          <div className="form-group col-12">
            <label>any notes to help?</label>
            <textarea className="form-control" value={url.seed_notes} onChange={this.handleChange.bind(this, 'seed_notes')} placeholder="" />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-12">
            <label>url</label>
            <input className="form-control" type="text" value={url.url} onChange={this.handleChange.bind(this, 'url')} placeholder="" />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <input className="btn btn-primary btn-large" type="submit" value="add url(s)" />
          </div>
        </div>
      </form>
    );
  }
}

UrlInfoForm.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  events: PropTypes.array,
  agencies: PropTypes.array,
};

UrlInfoForm.defaultProps = {
  submitText: 'Create Event',
  events: [],
  agencies: [],
};
