/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, jsx-a11y/no-static-element-interactions */
import React, { PropTypes } from 'react';

export default class UrlPhaseBag extends React.Component {

  handleToggleCollapse() {
    this.props.onToggleCollapse('bag');
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }

  handleCheckboxChange(name, e) {
    this.props.onCheckboxChange(name, e);
  }

  handleUpdate(e) {
    e.preventDefault();
    this.props.onUpdate('bag');
  }

  render() {
    const { url, disabled, collapsed, visible } = this.props;

    // crawlable urls can't be bagged, admins & baggers are the only ones who can see the bag phase
    if (url.crawlable || !visible) {
      return <div className="bag phase row" />;
    }

    let form;

    if (!collapsed) {
      form = (
        <form onSubmit={this.handleUpdate.bind(this)}>
          <br />
          <div className="form-group">
            <div className="form-group">
              <label>Harvest Url / Location</label>
              <input className="form-control" readOnly={disabled} value={url.harvest_url} onChange={this.handleChange.bind(this, 'harvest_url')} />
            </div>
          </div>
          <hr />
          <div className="form-group">
            <label className="form-check-label">
              <input className="form-check-input" disabled={disabled} type="checkbox" value={url.done} checked={url.done} onChange={this.handleCheckboxChange.bind(this, 'done')} />
              <strong>I certify that to the best of my knowledge this is a well-checked bag that will survive out of context of the site it was harvested from.</strong>
            </label>
          </div>
          <hr />
          <div className="form-group">
            <h4>Upload Bagged File</h4>
            <p>For now we&rsquo;re using an external uploader to upload bags, use these links to upload files, and then copy the uploaded url to &ldquo; Bag Url&rdquo; below & save.</p>
            <p>username: <i>hashingitup</i> password: <i>checksumstoo</i></p>
            <div className="row">
              <div className="col-6">
                <p><a href={'//drp-upload-bagger.herokuapp.com'} target="_blank" rel="noopener noreferrer">Use Web Uploader</a></p>
              </div>
              <div className="col-6">
                <p><a href={`//drp-upload-bagger.herokuapp.com/burner?object_name=${url.uuid}.zip&dir=remote`} target="_blank" rel="noopener noreferrer">Generate Upload Token</a></p>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Bag Url</label>
            <input className="form-control" readOnly={disabled} value={url.bag_url} onChange={this.handleChange.bind(this, 'bag_url')} />
          </div>
          <div className="form-group">
            <label>Notes From Bagging</label>
            <textarea className="form-control" readOnly={disabled} value={url.bag_notes} onChange={this.handleChange.bind(this, 'bag_notes')} />
          </div>
          { !disabled ? <input className="btn btn-primary" type="submit" value="save" /> : undefined }
        </form>
      );
    }

    const headerClasses = `phase-title status-bag-text ${collapsed ? 'is-collapsed' : 'is-open'}`;

    return (
      <div className="bag phase row">
        <div className="col">
          <hr />
          <h4 className={headerClasses} onClick={this.handleToggleCollapse.bind(this)}>Bag</h4>
          <div className="checkbox-wrap">
            <div className="mark-complete checkbox">
              <input id="bag_done" disabled={disabled} type="checkbox" checked={url.bag_done} onChange={this.handleCheckboxChange.bind(this, 'bag_done')} />
              <label htmlFor="bag_done" className={url.bag_done ? 'status-bag' : undefined} />
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

UrlPhaseBag.propTypes = {
  url: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,

  onChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

UrlPhaseBag.defaultProps = {
};
