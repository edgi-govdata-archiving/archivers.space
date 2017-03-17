/* eslint-disable no-console, meteor/no-session, react/jsx-no-bind */
import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

class UseUploadToken extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  handleGenerateUploadToken() {
    // eslint-disable-next-line react/prop-types
    browserHistory.push(`/urls/${this.props.url.uuid}/upload`);
  }

  handleConfirmUploaded() {
    // eslint-disable-next-line react/prop-types
    const { onSuccess, url } = this.props;
    // TODO - hard-coded for now
    const path = `https://s3.amazonaws.com/drp-upload/remote/${url.uuid}.zip`;
    console.log('checking path:', path);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        onSuccess(path, () => {
          Session.set('messages.success', 'uploaded file confirmed!');
          setTimeout(() => {
            Session.set('messages.success', '');
          }, 3500);
        });
      } else if (xhr.readyState === 4) {
        console.log('not found');
        Session.set('messages.error', 'uploaded file not found');
        setTimeout(() => {
          Session.set('messages.error', '');
        }, 3500);
      }
    };
    // Post data to URL which handles post request
    xhr.open('HEAD', path);
    xhr.send();
  }

  renderConfirmUploaded() {
    // eslint-disable-next-line react/prop-types
    const { url, disabled } = this.props;

    return (
      <div className="use-upload-token">
        <Link to={`/urls/${url.uuid}/upload`}>upload instructions</Link>
        <br />
        <button className="btn btn-primary" disabled={disabled} onClick={this.handleConfirmUploaded.bind(this)}>Check for uploaded file</button>
      </div>
    );
  }

  renderGenerate() {
    // eslint-disable-next-line react/prop-types
    const { disabled } = this.props;
    return (
      <div className="use-upload-token">
        <button className="btn btn-primary" disabled={disabled} onClick={this.handleGenerateUploadToken.bind(this)}>Generate Upload Token</button>
      </div>
    );
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { credentials } = this.props;
    if (credentials) {
      return this.renderConfirmUploaded();
    }
    return this.renderGenerate();
  }
}

UseUploadToken.propTypes = {
  // eslint-disable-next-line react/require-default-props
  onSuccess: PropTypes.func,
};

UseUploadToken.defaultProps = {
};

export default createContainer((props) => {
  const { url = {} } = props;
  return Object.assign({
    credentials: Session.get(`credentials.${url.uuid}`),
  }, props);
}, UseUploadToken);
