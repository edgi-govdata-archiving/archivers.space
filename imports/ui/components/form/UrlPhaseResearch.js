/* eslint-disable jsx-a11y/label-has-for, react/jsx-no-bind, react/forbid-prop-types, jsx-a11y/no-static-element-interactions, react/require-default-props */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import UrlSearch from '../UrlSearch';

export default class UrlPhaseResearch extends React.Component {

  handleToggleCollapse() {
    this.props.onToggleCollapse('research');
  }

  handleChange(name, value) {
    this.props.onChange(name, value);
  }

  handleCheckboxChange(name, e) {
    this.props.onCheckboxChange(name, e);
  }

  handleUpdate(e) {
    e.preventDefault();
    this.props.onUpdate('research');
  }

  handleSelectLinkUrl(url) {
    this.props.onLinkUrl(url);
  }

  handleUnlinkUrl(url) {
    this.props.onUnlinkUrl(url);
  }

  renderResearchFields(url, disabled) {
    return (
      <div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" disabled={disabled} type="checkbox" value={url.has_dynamic_content} checked={url.has_dynamic_content} onChange={this.handleCheckboxChange.bind(this, 'has_dynamic_content')} />
            Page contains dynamic content (e.g., links loaded by JavaScript).
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" disabled={disabled} type="checkbox" value={url.has_vis} checked={url.has_vis} onChange={this.handleCheckboxChange.bind(this, 'has_vis')} />
            Page contains interactive visualizations.
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" disabled={disabled} type="checkbox" value={url.has_direct_download} checked={url.has_direct_download} onChange={this.handleCheckboxChange.bind(this, 'has_direct_download')} />
            Data is accessible in structured file(s) that can be directly downloaded.
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" disabled={disabled} type="checkbox" value={url.is_ftp} checked={url.is_ftp} onChange={this.handleCheckboxChange.bind(this, 'is_ftp')} />
            Data is accessible over FTP.
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" disabled={disabled} type="checkbox" value={url.has_api} checked={url.has_api} onChange={this.handleCheckboxChange.bind(this, 'has_api')} />
            Data is accessible using a documented public API.
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input className="form-check-input" disabled={disabled} type="checkbox" value={url.has_form} checked={url.has_form} onChange={this.handleCheckboxChange.bind(this, 'has_form')} />
            Data is only accessible using search queries in a web form.
          </label>
        </div>
        <div className="form-group">
          <label>Recommended Approach for Harvesting Data</label>
          <textarea className="form-control" readOnly={disabled} value={url.recommended_approach} onChange={this.handleChange.bind(this, 'recommended_approach')} />
          <p className="help-block">If this will be handed off to someone else to harvest, pass on any useful info here.</p>
        </div>
        <div className="form-group">
          <label>File Formats</label>
          <input className="form-control" readOnly={disabled} value={url.file_types} onChange={this.handleChange.bind(this, 'file_types')} />
          <p className="help-block">such as: PDF, CSV, XLSX, JSON, HDF5</p>
        </div>
        <div className="form-group">
          <label>Estimated Size in MB</label>
          <input className="form-control" readOnly={disabled} value={url.estimated_size} onChange={this.handleChange.bind(this, 'estimated_size')} />
          <p className="help-block">If less than couple MB, this is not so important to fill out.</p>
        </div>
      </div>
    );
  }

  render() {
    const { url, disabled, collapsed, groupUrls } = this.props;

    let form;

    if (!collapsed) {
      form = (
        <form onSubmit={this.handleUpdate.bind(this)}>
          <div className="form-group">
            <label>Page Title:</label>
            <input className="form-control" readOnly={disabled} value={url.title} onChange={this.handleChange.bind(this, 'title')} />
          </div>
          <div className="form-group">
            <label>Purpose / Significance of Data</label>
            <textarea className="form-control" readOnly={disabled} value={url.significance} onChange={this.handleChange.bind(this, 'significance')} />
            <p className="help-block">Optional. Ideally provided by a domain specialist or user of this kind of data.</p>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input className="form-check-input" disabled={disabled} type="checkbox" value={url.crawlable} checked={url.crawlable} onChange={this.handleCheckboxChange.bind(this, 'crawlable')} />
              <strong>Do not harvest.</strong> All data is small, unstructured, and on a page crawlable by the Internet Archive.
          </label>
          </div>
          { !url.crawlable ? this.renderResearchFields(url, disabled) : undefined }
          <h3>Link Url</h3>
          <p>Link URLs if they are closely related and would be most easily tackled as a group.</p>
          <UrlSearch disabled={disabled} onSelect={this.handleSelectLinkUrl.bind(this)} />
          <ul>
            {groupUrls.map((index) => {
              const urlLink = (
                <li key={index}>
                  <Link to={`/urls/${url.uuid}`}>{url.uuid || 'no uuid'} {url.url}</Link>
                  <a onClick={this.handleUnlinkUrl.bind(this, url)}>(Unlink)</a>
                </li>
              );
              return urlLink;
            })}
          </ul>
          { !disabled ? <input className="btn btn-primary" type="submit" value="save" /> : undefined }
        </form>
      );
    }

    const headerClasses = `phase-title status-research-text ${collapsed ? 'is-collapsed' : 'is-open'}`;

    return (
      <div className="research phase row">
        <div className="col">
          <hr />
          <h4 className={headerClasses} onClick={this.handleToggleCollapse.bind(this)}>Research</h4>
          <div className="checkbox-wrap">
            <div className="mark-complete checkbox">
              <input type="checkbox" id="research_done" disabled={disabled} value={url.research_done} checked={url.research_done} onChange={this.handleCheckboxChange.bind(this, 'research_done')} />
              <label htmlFor="research_done" className={url.research_done ? 'status-research' : undefined} />
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

UrlPhaseResearch.propTypes = {
  url: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  collapsed: PropTypes.bool.isRequired,
  groupUrls: PropTypes.array.isRequired,

  onChange: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,

  onLinkUrl: PropTypes.func.isRequired,
  onUnlinkUrl: PropTypes.func.isRequired,
};

UrlPhaseResearch.defaultProps = {
};
