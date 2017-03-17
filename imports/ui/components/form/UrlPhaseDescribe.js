/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, jsx-a11y/no-static-element-interactions */
import React, { PropTypes } from 'react';

export default class UrlPhaseDescribe extends React.Component {
  handleToggleCollapse() {
    this.props.onToggleCollapse('describe');
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }

  handleCheckboxChange(name, e) {
    this.props.onCheckboxChange(name, e);
  }

  handleUpdate(e) {
    e.preventDefault();
    this.props.onUpdate('describe');
  }

  render() {
    const { url, disabled, collapsed, visible } = this.props;

    // crawlable urls can't be described
    if (url.crawlable || !visible) {
      return <div className="describe phase row" />;
    }

    let form;

    if (!collapsed) {
      form = (
        <form onSubmit={this.handleUpdate.bind(this)}>
          <br />
          <div className="form-group">
            <div className="form-group">
              <label>Bag Url / Location</label>
              <input className="form-control" readOnly={disabled} value={url.bag_url} onChange={this.handleChange.bind(this, 'bag_url')} />
            </div>
          </div>
          <div className="form-group">
            <div className="form-group">
              <label>CKAN Url</label>
              <input className="form-control" readOnly={disabled} value={url.ckan_url} onChange={this.handleChange.bind(this, 'ckan_url')} />
            </div>
          </div>
          <div className="form-group">
            <label>Notes From Describe</label>
            <textarea className="form-control" readOnly={disabled} value={url.describe_notes} onChange={this.handleChange.bind(this, 'describe_notes')} />
          </div>
          { !disabled ? <input className="btn btn-primary" type="submit" value="save" /> : undefined }
        </form>
      );
    }

    const headerClasses = `phase-title status-describe-text ${collapsed ? 'is-collapsed' : 'is-open'}`;

    return (
      <div className="describe phase row">
        <div className="col">
          <hr />
          <h4 className={headerClasses} onClick={this.handleToggleCollapse.bind(this)}>Describe</h4>
          <div className="checkbox-wrap">
            <div className="mark-complete checkbox">
              <input id="describe_done" disabled={disabled} type="checkbox" checked={url.describe_done} onChange={this.handleCheckboxChange.bind(this, 'describe_done')} />
              <label htmlFor="describe_done" className={url.describe_done ? 'status-describe' : undefined} />
            </div>
            <div className="checkbox-pseudolabel">
              Check here when this stage is complete
            </div>
          </div>
          <div className="clear" />
          {form}
        </div>
      </div>
    );
  }
}

UrlPhaseDescribe.propTypes = {
  url: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,

  onChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

UrlPhaseDescribe.defaultProps = {
};
