/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';

export default class AgencyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Object.assign({}, props.data),
    };
  }

  handleChange(name, e) {
    const data = Object.assign({}, this.state.data, { [name]: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(name, e.target.value, e);
    }
    this.setState({ data });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.data, event);
  }

  render() {
    const { message, error, submitText } = this.props;
    const agency = this.state.data;

    return (
      <form className="agency form" onSubmit={this.handleSubmit.bind(this)}>
        {message ? <p className="has-success">{message}</p> : undefined}
        {error ? <p className="has-danger">{error}</p> : undefined}
        <div className="row">
          <div className="form-group col-6">
            <label>Name</label>
            <input className="form-control" type="text" name="name" placeholder="" value={agency.name} onChange={this.handleChange.bind(this, 'name')} />
          </div>
          <div className="form-group col-2">
            <label>Acronym</label>
            <input className="form-control" type="text" name="acronym" placeholder="" value={agency.acronym} onChange={this.handleChange.bind(this, 'acronym')} />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-3">
            <label>agency id</label>
            <input className="form-control" type="text" name="agency_id" placeholder="" value={agency.agency_id} onChange={this.handleChange.bind(this, 'agency_id')} />
          </div>
          <div className="form-group col-3">
            <label>subagency id</label>
            <input className="form-control" type="text" name="subagency_id" placeholder="" value={agency.subagency_id} onChange={this.handleChange.bind(this, 'subagency_id')} />
          </div>
        </div>

        <div className="row">
          <div className="form-group col-6">
            <label>description</label>
            <textarea className="form-control" name="description" placeholder="" value={agency.description} onChange={this.handleChange.bind(this, 'description')} />
          </div>
        </div>

        <input className="btn btn-primary btn-large" type="submit" value={submitText} />

      </form>
    );
  }
}

AgencyForm.propTypes = {
  submitText: PropTypes.string,

  data: PropTypes.object,

  message: PropTypes.string,
  error: PropTypes.string,

  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};

AgencyForm.defaultProps = {
  submitText: 'Create Agency',
};
