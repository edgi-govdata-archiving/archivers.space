/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, jsx-a11y/no-static-element-interactions, react/require-default-props */
import React, { PropTypes } from 'react';

import UploadFile from '../UploadFile';
import UseUploadToken from '../UseUploadToken';

import { formatMetadataJSON } from '../../../selectors/url';
import { saveAs } from '../../../libs/saveAs';

export default class UrlPhaseHarvest extends React.Component {

  handleDownloadStarter(e) {
    e.preventDefault();
    const { url, currentUser } = this.props;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function onreadystatechange() {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        saveAs(xhttp.response, `${url.uuid}.zip`);
      }
    };
    // Post data to URL which handles post request
    xhttp.open('POST', '//zip-starter.archivers.space');
    xhttp.setRequestHeader('Content-Type', 'application/json');
    // You should set responseType as blob for binary responses
    xhttp.responseType = 'blob';
    xhttp.send(JSON.stringify(formatMetadataJSON(url, currentUser)));
  }

  handleToggleCollapse() {
    this.props.onToggleCollapse('harvest');
  }

  handleUploadSuccess(e) {
    this.props.onUploadSuccess('harvest_url', e);
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }

  handleCheckboxChange(name, e) {
    this.props.onCheckboxChange(name, e);
  }

  handleUpdate(e) {
    e.preventDefault();
    this.props.onUpdate('harvest');
  }

  render() {
    const { collapsed, url, disabled, uploadCredentials } = this.props;

    // crawlable urls can't be harvested
    if (url.crawable) {
      return <div className="harvest phase row" />;
    }

    let form;

    if (!collapsed) {
      form = (
        <div>
          <br />
          <h5>1. Zip Starter</h5>
          <i>Download a starter archive to store the results of your harvest</i>
          <br />
          <button className="btn btn-primary" disabled={disabled} onClick={this.handleDownloadStarter.bind(this)}>Download Zip Starter</button>
          <hr />
          <h5>2. Upload File</h5>
          <div className="row">
            <div className="col-6">
              <h6>Web Upload</h6>
              <small>Use this to upload finished .zip archives up to 5Gb in size.</small>
              <UploadFile name="harvest_url" disabled={disabled} dir="remote" onSuccess={this.handleUploadSuccess.bind(this, 'harvest_url')} />
            </div>
            <div className="col-6">
              <h6>Upload via AWS token</h6>
              <small>(advanced) For larger files or archives stored on remote machines, generate an upload token.</small>
              <br />
              <UseUploadToken disabled={disabled} credentials={uploadCredentials} url={url} onSuccess={this.handleUploadSuccess.bind(this, 'harvest_url')} />
            </div>
          </div>
          <form disabled={disabled} onSubmit={this.handleUpdate.bind(this)}>
            <hr />
            <h5>3. Add Harvest Details</h5>
            <div className="form-check">
              <label className="form-check-label">
                <input className="form-check-input" disabled={disabled} type="checkbox" checked={url.all_data_captured} onChange={this.handleCheckboxChange.bind(this, 'all_data_captured')} />
              Were you able to capture all of the data at this url?
              </label>
            </div>
            <div className="form-group">
              <label>Harvest Method Used</label>
              <input className="form-control" readOnly={disabled} value={url.harvest_method || ''} onChange={this.handleChange.bind(this, 'harvest_method')} />
            </div>
            <div className="form-group">
              <label>Notes From Harvest</label>
              <textarea className="form-control" readOnly={disabled} value={url.harvest_notes} onChange={this.handleChange.bind(this, 'harvest_notes')} />
            </div>
            { !disabled ? <input className="btn btn-primary" type="submit" value="save" /> : undefined }
          </form>
        </div>
      );
    }

    const headerClasses = `phase-title status-harvest-text ${collapsed ? 'is-collapsed' : 'is-open'}`;

    return (
      <div className="harvest phase row">
        <div className="col">
          <hr />
          <h4 className={headerClasses} onClick={this.handleToggleCollapse.bind(this)}>Harvest</h4>
          <div className="checkbox-wrap">
            <div className="mark-complete checkbox">
              <input className="form-check-input" id="harvest_done" disabled={disabled} type="checkbox" checked={url.harvest_done} onChange={this.handleCheckboxChange.bind(this, 'harvest_done')} />
              <label htmlFor="harvest_done" className={url.harvest_done ? 'status-harvest' : undefined} />
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

UrlPhaseHarvest.propTypes = {
  url: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  uploadCredentials: PropTypes.object,

  onChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

UrlPhaseHarvest.defaultProps = {
};
