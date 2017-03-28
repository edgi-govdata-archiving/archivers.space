/* global btoa */
/* eslint-disable jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Spinner from '../../components/Spinner';
import { uploadPath } from '../../../selectors/url';
import Analytics from '../../../libs/analytics';

class UploadToken extends React.Component {
  componentWillMount() {
    Analytics.page();
    if (!this.props.credentials) {
      this.handleGenerateUploadToken.call(this);
    }
  }

  generateUploadToken() {
    // eslint-disable-next-line react/prop-types
    const { filename, uuid, uploadDir, tokenServerUrl, tokenServerHttpUsername, tokenServerHttpPassword } = this.props;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function onreadystatechange() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let credentials;
        try {
          credentials = JSON.parse(this.responseText);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Signing server returned some ugly/empty JSON: "${this.responseText}"`);
          return false;
        }

        // eslint-disable-next-line meteor/no-session
        Session.set(`credentials.${uuid}`, credentials);
      }

      return true;
    };
    // Post data to URL which handles post request
    xhr.open('GET', `${tokenServerUrl}?object_name=${filename}&dir=${uploadDir}&format=json`);
    if (tokenServerHttpUsername && tokenServerHttpPassword) {
      xhr.withCredentials = true;
      const auth = btoa(`${tokenServerHttpUsername}:${tokenServerHttpPassword}`);
      xhr.setRequestHeader('Authorization', `Basic ${auth}`);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  }

  handleGenerateUploadToken(e) {
    if (e) { e.preventDefault(); }
    this.generateUploadToken();
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { path, filename, bucket, region, credentials, uuid } = this.props;
    if (!credentials) {
      return <Spinner />;
    }
    return (
      <div id="uploadInstructions" className="model page">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="title">Temp Upload Token</h1>
              <Link to={`/urls/${uuid}`}>{uuid}</Link>
              <p>These credentials only allow you to upload a single file to the aws S3 path: <b>s3.amazonaws.com/{ bucket }/{ path }</b>. These credentials will expire { credentials.Expiration }</p>
              <label>Credentials:</label>
              <pre>{ JSON.stringify(credentials, null, 4) }</pre>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h3>Uploading using aws CLI (Command-Line Interface)</h3>
              <p>The following guide assumes that you have the aws <a href="https://aws.amazon.com/cli/">command line interface</a> installed. Assuming you have the CLI installed, the two steps are to first configure the client to use these credentials, and then run the upload.</p>
              <h4>1. Export Env Variable settings</h4>
              <p>On Unix / Mac operating systems in a terminial enter the following (note the lines are long, copy &amp; paste carefully):</p>
              <pre>export AWS_ACCESS_KEY_ID={ credentials.AccessKeyId }<br />
              export AWS_SECRET_ACCESS_KEY={ credentials.SecretAccessKey }<br />
              export AWS_SESSION_TOKEN={ credentials.SessionToken }</pre>
              <p>On a PC those same commands would look like this:</p>
              <pre>SET AWS_ACCESS_KEY_ID={ credentials.AccessKeyId }<br />
              SET AWS_SECRET_ACCESS_KEY={ credentials.SecretAccessKey }<br />
              SET AWS_SESSION_TOKEN={ credentials.SessionToken }</pre>
              <h4>2. Upload Your File</h4>
              <p>Assuming the file you&apos;d like to upload is in the current directory, run the following command to upload your file:</p>
              <pre>aws s3 cp { filename } s3://{ bucket }/{ path } --region { region }</pre>
              <h4>3. Stand up & do a little dance</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UploadToken.propTypes = {
  uploadDir: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  bucket: PropTypes.string.isRequired,
  credentials: PropTypes.object,

  tokenServerUrl: PropTypes.string.isRequired,
  tokenServerHttpUsername: PropTypes.string,
  tokenServerHttpPassword: PropTypes.string,
};

UploadToken.defaultProps = {
  region: 'us-east-1',
  bucket: 'drp-upload',
  uploadDir: 'remote',

  tokenServerUrl: '//drp-upload.herokuapp.com/burner',
  tokenServerHttpUsername: 'didyouaddyour',
  tokenServerHttpPassword: 'metadata',
};

export default createContainer(({ params }) => {
  const { uuid } = params;
  // eslint-disable-next-line meteor/no-session
  let credentials = Session.get(`credentials.${uuid}`);
  if (credentials) {
    credentials = credentials.Credentials;
  }

  return {
    filename: `${uuid}.zip`,
    uuid,
    // generate path with a fake url entry that only contains the uuid:
    path: uploadPath({ uuid }),
    credentials,
  };
}, UploadToken);
