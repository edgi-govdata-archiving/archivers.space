/* eslint-disable class-methods-use-this, meteor/no-session, react/prop-types, react/jsx-no-bind, jsx-a11y/no-static-element-interactions, react/forbid-prop-types */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import Urls from '../../../api/urls';
import { phaseSelector } from '../../../selectors/url';

import TableItems from '../../components/TableItems';
import UrlItem from '../../components/item/UrlItem';

const MAX_PAGE_SIZE = 200;

// UrlsList component - represents the whole app
class UrlsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleQueryChange(e) {
    Session.set('urls.query', e.target.value);
  }

  handleClearQuery() {
    Session.set('urls.query', '');
  }

  render() {
    const { query, phase, count, urls, page, pageSize, hasMore, description } = this.props;

    return (
      <div id="urls" className="list page">
        <div className="container">
          <header className="header">
            <Link className="new" to="/urls/new">Add Url</Link>
            <h3 className="title">{count}{count === MAX_PAGE_SIZE ? '+' : undefined } {query ? '' : phase} { count === 1 ? 'url' : 'urls' }</h3>
            <input type="text" value={query} onChange={this.handleQueryChange.bind(this)} name="search" />
            { query ? <a onClick={this.handleClearQuery.bind(this)}>x</a> : undefined }
            <div className="phases" style={{ opacity: query ? 0.3 : 1 }}>
              <Link to="/urls?phase=research" className={(phase === 'research') ? 'status-research-text' : 'inactive'}>Research</Link>
              <Link to="/urls?phase=harvest" className={(phase === 'harvest') ? 'status-harvest-text' : 'inactive'}>Harvest</Link>
              <Link to="/urls?phase=bag" className={(phase === 'bag') ? 'status-bag-text' : 'inactive'}>Bag</Link>
              <Link to="/urls?phase=describe" className={(phase === 'describe') ? 'status-describe-text' : 'inactive'}>Describe</Link>
              <Link to="/urls?phase=done" className={(phase === 'done') ? 'status-done-text' : 'inactive'}>Done</Link>
              {<Link to="/urls?phase=crawlable" className={(phase === 'crawlable') ? 'status-crawlable-text' : 'inactive'}>Crawlable</Link>}
            </div>
            <div className="description">
              { description }
            </div>
          </header>
          <table className="items table table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>!</th>
                <th>uuid</th>
                <th>url</th>
                <th>user</th>
              </tr>
            </thead>
            <TableItems data={urls} component={UrlItem} />
          </table>
          { hasMore ? <a href={`/urls?phase=${phase}&page=${page + 1}&pageSize=${pageSize}`}><button className="btn btn-primary">Load More</button></a> : undefined}
          <div className="clear" />
        </div>
      </div>
    );
  }
}

UrlsList.propTypes = {
  urls: PropTypes.array.isRequired,
};

export default createContainer(({ location }) => {
  // eslint-disable-next-line prefer-const
  let { phase = 'research', page = '1', pageSize = `${MAX_PAGE_SIZE}`, q = '' } = location.query;
  page = +page || 1;
  pageSize = +pageSize || MAX_PAGE_SIZE;

  const user = Meteor.user();
  let admin = false;
  if (user) {
    admin = Roles.userIsInRole(user._id, 'admin', Roles.GLOBAL_GROUP);
  }

  let urls;
  let subscription;
  let selector;
  const query = Session.get('urls.query') || q;
  if (query) {
    Meteor.subscribe('urls', page * pageSize);
    urls = Urls.find({ $or: [{ url: new RegExp(`.*${query}.*`, 'i') }, { uuid: new RegExp(`.*${query}.*`, 'i') }] }, { limit: 30 }).fetch();
  } else {
    subscription = (phase === '') ? 'urls' : `urls.${phase}`;
    selector = phaseSelector(phase);
    Meteor.subscribe(subscription, page * pageSize);
    urls = Urls.find(selector, { sort: [['priority', 'desc'], ['createdAt', 'desc']] }).fetch();
  }

  let description;
  switch (phase) {
    case 'research':
      description = 'These URLs are ready to be investigated to determine whether they can be automatically crawled or how they could best be manually harvested.';
      break;

    case 'harvest':
      description = 'These URLs are ready to be manually harvested.';
      break;

    case 'bag':
      description = 'These URLs are ready to be packaged into standards-compliant &quot;bags&quot; suitable for long-term storage.';
      break;

    case 'describe':
      description = 'These URLs are ready to be added to the publicly accessible Data Refuge repository along with some descriptive metadata.';
      break;

    case 'done':
      description = 'These URLs were successfully harvested, bagged, and described.';
      break;

    case 'crawlable':
      description = 'These URLs do not need to be harvested manually. Instead they were submitted to the Internet Archive to be crawled.';
      break;

    default:
      description = '';
      break;
  }

  return {
    phase,
    urls,
    page,
    pageSize,
    query,
    // hasMore: (urls.length < pageSize * page),
    count: urls.length,
    user,
    admin,
    description,
  };
}, UrlsList);
