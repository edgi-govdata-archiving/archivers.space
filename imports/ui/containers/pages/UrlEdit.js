/* eslint-disable meteor/no-session, no-console, no-alert, react/prop-types, react/jsx-no-bind, jsx-a11y/no-static-element-interactions, jsx-a11y/label-has-for, react/forbid-prop-types, react/require-default-props */
import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Urls from '../../../api/urls';
import UrlGroups from '../../../api/url_groups';
import Events from '../../../api/events';
import Agencies from '../../../api/agencies';

import { status, phaseNum } from '../../../selectors/url';

import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import UrlLock from '../../components/UrlLock';
import UrlForm from '../../components/form/UrlForm';

import UrlPhaseResearch from '../../components/form/UrlPhaseResearch';
import UrlPhaseHarvest from '../../components/form/UrlPhaseHarvest';
import UrlPhaseBag from '../../components/form/UrlPhaseBag';
import UrlPhaseDescribe from '../../components/form/UrlPhaseDescribe';

function saveCb(err) {
  if (err) {
    Session.set('messages.error', 'url updated');
    setTimeout(() => {
      Session.set('messages.error', '');
    }, 1000);
  } else {
    Session.set('messages.success', 'url updated');
    setTimeout(() => {
      Session.set('messages.success', '');
    }, 3500);
  }
}

class Url extends React.Component {
  constructor(props) {
    super(props);

    let collapse = {
      research: false,
      harvest: false,
      bag: false,
      describe: false,
      finalize: false,
      contributors: false,
    };

    if (this.props.url) {
      const phase = status(this.props.url);
      collapse = {
        research: false,
        harvest: true,
        bag: true,
        describe: true,
        finalize: true,
        contributors: true,
      };

      collapse[phase] = false;
    }

    this.state = {
      collapse,
      editing: false,
      changes: {},
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.url && nextProps.url) {
      const phase = status(nextProps.url);
      const collapse = {
        research: true,
        harvest: true,
        bag: true,
        describe: true,
        finalize: true,
        contributors: true,
      };
      collapse[phase] = false;
      this.setState({ collapse });
    }

    // Query Internet Archive to check whether this URL is available.
    if (nextProps.url && !this.state.iaAvailablility) {
      const url = nextProps.url.url;
      Meteor.call('queryIA', url, {}, (error, response) => {
        if (error) {
          console.log('Querying Internet Archive failed', error);
        } else if (response.data.archived_snapshots.closest) {
          this.setState({ iaAvailability: true });
        } else {
          this.setState({ iaAvailability: false });
        }
      });
    }
  }

  handleLock() {
    if (this.props.prev) {
      if (confirm(`checking out this url will unlock url: ${this.props.prev.url}`)) {
        Meteor.call('urls.lock', this.props.url._id);
      }
      return;
    }
    Meteor.call('urls.lock', this.props.url._id);
  }

  handleUnlock() {
    Meteor.call('urls.unlock', this.props.url._id);
  }

  handleDelete() {
    if (confirm('are you sure you want to delete this url?')) {
      Meteor.call('urls.remove', this.props.url._id, (error) => {
        if (error) {
          this.setState({ error: error.message });
        } else {
          browserHistory.push('/urls');
        }
      });
    }
  }

  handleChangePriority(e) {
    const value = e.target.value ? +e.target.value : undefined;
    Meteor.call('urls.setPriority', this.props.url._id, value);
  }

  handleGenerateUploadToken() {
    browserHistory.push(`/urls/${this.props.url.uuid}/upload`);
  }

  handleEdit() {
    document.getElementById('body').setAttribute('class', 'modal-open');
    this.setState({ editing: true });
  }

  handleCloseModal() {
    document.getElementById('body').setAttribute('class', '');
    this.setState({ editing: false });
  }

  handleToggleCollapse(name) {
    const collapse = Object.assign({}, this.state.collapse, { [name]: !this.state.collapse[name] });
    this.setState({ collapse });
  }

  handleChange(name, e) {
    const changes = Object.assign({}, this.state.changes, { [name]: e.target.value });
    this.setState({ changes });
  }

  handleCheckboxChange(name, e) {
    const changes = Object.assign({}, this.state.changes, { [name]: e.target.checked });
    this.setState({ changes });
  }

  handleUpdateUrlInfo(update) {
    this.handleCloseModal();
    if (!update || !update._id) {
      return;
    }
    const id = update._id;
    // eslint-disable-next-line no-param-reassign
    delete update._id;
    Meteor.call('urls.update', id, update, (err) => {
      if (err) {
        this.setState({ error: err.error });
      } else {
        this.setState({ editing: false, error: undefined });
      }
    });
  }

  handleUpdate() {
    if (!this.state.changes || Object.keys(this.state.changes).length === 0) {
      return;
    }
    Meteor.call('urls.update', this.props.url._id, this.state.changes, saveCb);
  }

  handleUploadSuccess(name, url, cb) {
    Meteor.call('urls.update', this.props.url._id, { [name]: url }, (err) => {
      if (err) {
        saveCb(err);
      } else if (cb) {
        cb();
      }
    });
  }

  handleLinkUrl(url) {
    Meteor.call('urlGroups.link', this.props.url._id, url._id);
  }

  // eslint-disable-next-line class-methods-use-this
  handleUnlinkUrl(url) {
    Meteor.call('urlGroups.unlink', url._id);
  }

  renderModal() {
    if (this.state.editing !== true) {
      return undefined;
    }
    return (
      <Modal title={'Edit Url'} onCancel={this.handleCloseModal.bind(this)}>
        <UrlForm events={this.props.events} agencies={this.props.agencies} data={this.props.url} submitText="Save" error={this.state.error} onSubmit={this.handleUpdateUrlInfo.bind(this)} />
      </Modal>
    );
  }

  renderContributors() {
    let bullets;
    if (!this.state.collapse.contributors) {
      bullets = (
        <ul>
          {this.props.contributors.map((username, index) => {
            // eslint-disable-next-line react/no-array-index-key
            const bullet = (<li key={index}> {username} </li>);
            return bullet;
          })}
        </ul>
      );
    }
    return (
      <div className="contributors row">
        <div className="col">
          <hr />
          <h5 onClick={this.handleToggleCollapse.bind(this, 'contributors')}>Contributors</h5>
          {bullets}
        </div>
      </div>
    );
  }

  renderPriority() {
    return (
      <div className="priority">
        <div className="form-group">
          <label>Priority</label>
          <select className="form-control" value={this.props.url.priority} onChange={this.handleChangePriority.bind(this)}>
            <option value="">--</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
    );
  }

  render() {
    const { currentUser, uploadCredentials, groupUrls } = this.props;
    const { admin, bagger, describer } = this.props.currentUserRoles;
    const url = Object.assign({}, this.props.url, this.state.changes);
    const phase = status(this.props.url);
    const currentPhaseNum = phaseNum(this.props.url);
    const iaAvailability = this.state.iaAvailability;
    let iaText = 'Loading...';

    if (typeof (iaAvailability) !== 'undefined') {
      iaText = iaAvailability ? 'Yes' : 'No';
    }

    // form editing is disabled if there is no current user, or if the current user's id doesn't match the lock userId
    const disabled = (!this.props.currentUser || (url.locked ? (this.props.currentUser._id !== url.locked) : true));

    if (!this.props.url) {
      return (<Spinner />);
    }

    return (
      <div id="url" className="model page">
        {this.renderModal()}
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="actions">
                { admin ? <a onClick={this.handleDelete.bind(this)}>Delete</a> : undefined }
                { admin ? <a onClick={this.handleEdit.bind(this)}>Edit Details</a> : undefined }
              </div>
              {this.renderPriority()}
              <h3 className="title"><a href={url.url} target="_blank" rel="noopener noreferrer" className={`status-${phase}-text`}>{url.url}</a></h3>
              <h4 className="subtitle">{url.uuid}</h4>
              <h5>status: <span className={`status-${phase}-text`}>{phase}</span></h5>
              <hr />
              <UrlLock currentUser={currentUser} admin={admin} url={url} handleLock={this.handleLock.bind(this)} handleUnlock={this.handleUnlock.bind(this)} />
              <hr />
              <h4>Info</h4>
            </div>
          </div>
          <div className="info row">
            <div className="col-6">
              <p><i>Agency:</i> <Link to={`/agencies/${url.agency}`}>{url.agency_name}</Link></p>
              <p><i>Title:</i> {url.title}</p>
              <p><i>Description:</i> {url.description}</p>
            </div>
            <div className="col-6">
              <p><i>Event:</i> <Link to={`/events/${url.event}`}>{url.event_name}</Link></p>
              <p><i>Crawled by Internet Archive:</i> {iaText}</p>
            </div>
          </div>
          <UrlPhaseResearch
            url={url}
            disabled={disabled || !(currentPhaseNum >= -2)}
            collapsed={this.state.collapse.research}
            onChange={this.handleChange.bind(this)}
            onCheckboxChange={this.handleCheckboxChange.bind(this)}
            onToggleCollapse={this.handleToggleCollapse.bind(this)}
            onUpdate={this.handleUpdate.bind(this)}
            groupUrls={groupUrls}
            onLinkUrl={this.handleLinkUrl.bind(this)}
            onUnlinkUrl={this.handleUnlinkUrl.bind(this)}
          />
          <UrlPhaseHarvest
            url={url}
            currentUser={currentUser}
            disabled={disabled || !(currentPhaseNum >= -2)}
            collapsed={this.state.collapse.harvest}
            uploadCredentials={uploadCredentials}
            onChange={this.handleChange.bind(this)}
            onCheckboxChange={this.handleCheckboxChange.bind(this)}
            onToggleCollapse={this.handleToggleCollapse.bind(this)}
            onUploadSuccess={this.handleUploadSuccess.bind(this)}
            onUpdate={this.handleUpdate.bind(this)}
          />
          <UrlPhaseBag
            url={url}
            disabled={disabled || !(currentPhaseNum >= 2)}
            collapsed={this.state.collapse.bag}
            visible={(admin || bagger)}
            onChange={this.handleChange.bind(this)}
            onCheckboxChange={this.handleCheckboxChange.bind(this)}
            onToggleCollapse={this.handleToggleCollapse.bind(this)}
            onUpdate={this.handleUpdate.bind(this)}
          />
          <UrlPhaseDescribe
            url={url}
            disabled={disabled || !(currentPhaseNum >= 3)}
            collapsed={this.state.collapse.describe}
            visible={(admin || describer)}
            onChange={this.handleChange.bind(this)}
            onCheckboxChange={this.handleCheckboxChange.bind(this)}
            onToggleCollapse={this.handleToggleCollapse.bind(this)}
            onUpdate={this.handleUpdate.bind(this)}
          />
          {this.renderContributors(url, disabled)}
        </div>
      </div>
    );
  }
}

Url.propTypes = {
  url: PropTypes.object,
};

Url.defaultProps = {
};

export default createContainer(({ params }) => {
  Meteor.subscribe('urls');
  Meteor.subscribe('events');
  Meteor.subscribe('agencies');
  Meteor.subscribe('urlGroups');
  Meteor.subscribe('lockHistory');

  const currentUser = Meteor.user();
  const url = Urls.findOne({ uuid: params.uuid });
  let prev;
  let currentUserRoles = {
    admin: false,
    bagger: false,
    checker: false,
    describer: false,
  };
  let group;
  let groupUrls = [];
  const contributors = [];

  if (currentUser) {
    prev = Urls.findOne({ locked: currentUser._id });
    currentUserRoles = {
      admin: Roles.userIsInRole(currentUser._id, 'admin', Roles.GLOBAL_GROUP),
      bagger: Roles.userIsInRole(currentUser._id, 'bagger', Roles.GLOBAL_GROUP),
      checker: Roles.userIsInRole(currentUser._id, 'checker', Roles.GLOBAL_GROUP),
      describer: Roles.userIsInRole(currentUser._id, 'describer', Roles.GLOBAL_GROUP),
    };
  }
  if (url) {
    // Check if this URL is grouped with any others.
    group = UrlGroups.findOne({ urlIds: { $elemMatch: { $eq: url._id } } });
  }
  if (group) {
    // We want to display all group members except the current URL.
    const urlIds = group.urlIds;
    urlIds.splice(urlIds.indexOf(url._id), 1);
    groupUrls = urlIds.map(urlId => Urls.findOne(urlId));
  }

  return {
    currentUser,
    currentUserRoles,
    url,
    groupUrls,
    prev,
    // TODO - consider moving into UrlForm component
    events: Events.find().fetch(),
    agencies: Agencies.find().fetch(),
    contributors,
    uploadCredentials: Session.get(`credentials.${params.uuid}`),
  };
}, Url);
