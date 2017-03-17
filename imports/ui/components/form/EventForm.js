/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import DatePicker from 'react-datepicker';

require('react-datepicker/dist/react-datepicker.css');
const moment = require('moment');

export default class EventForm extends React.Component {
  constructor(props) {
    super(props);
    const { data = {} } = props;
    this.state = {
      data: Object.assign({
        name: '',
        url: '',
        poster_url: '',
        profile_url: '',
        description: '',
      }, props.data, {
        start: moment(data.start),
        stop: moment(data.stop),
      }),
    };
  }

  handleChange(name, e) {
    const data = Object.assign({}, this.state.data, { [name]: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(name, e.target.value, e);
    }
    this.setState({ data });
  }

  handleDateChange(name, date) {
    const data = Object.assign({}, this.state.data, { [name]: date });
    if (this.props.onChange) {
      this.props.onChange(name, date);
    }
    this.setState({ data });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = Object.assign({}, this.state.data);
    data.start = data.start.toDate();
    data.stop = data.stop.toDate();

    this.props.onSubmit(data, event);
  }

  render() {
    const { message, error, submitText } = this.props;
    const event = this.state.data;

    return (
      <form className="event form" onSubmit={this.handleSubmit.bind(this)}>
        {message ? <p className="has-success">{message}</p> : undefined}
        {error ? <p className="has-danger">{error}</p> : undefined}

        <div className="row">
          <div className="form-group col-6">
            <label>Name</label>
            <input className="form-control" type="text" name="name" placeholder="" value={event.name} onChange={this.handleChange.bind(this, 'name')} />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-6">
            <label>Event Url</label>
            <input className="form-control" type="text" name="url" placeholder="" value={event.url} onChange={this.handleChange.bind(this, 'url')} />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-6">
            <label>Poster Url</label>
            <input className="form-control" type="text" name="poster_url" placeholder="" value={event.poster_url} onChange={this.handleChange.bind(this, 'poster_url')} />
          </div>
          <div className="form-group col-6">
            <label>Profile Url</label>
            <input className="form-control" type="text" name="profile_url" placeholder="" value={event.profile_url} onChange={this.handleChange.bind(this, 'profile_url')} />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-3">
            <label>start</label>
            <br />
            <DatePicker className="form-control" selected={event.start} onChange={this.handleDateChange.bind(this, 'start')} />
          </div>
          <div className="form-group col-3">
            <label>end</label>
            <br />
            <DatePicker className="form-control" selected={event.stop} onChange={this.handleDateChange.bind(this, 'stop')} />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-6">
            <label>description</label>
            <textarea className="form-control" name="description" placeholder="" value={event.description} onChange={this.handleChange.bind(this, 'description')} />
          </div>
        </div>

        <input className="btn btn-primary btn-large" type="submit" value={submitText} />
      </form>
    );
  }
}

EventForm.propTypes = {
  submitText: PropTypes.string,

  data: PropTypes.object,

  message: PropTypes.string,
  error: PropTypes.string,

  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
  submitText: 'Create Event',
};
