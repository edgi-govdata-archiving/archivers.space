import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Urls from '../../../api/urls';
import { phaseSelector } from '../../../selectors/url';
import Analytics from '../../../libs/analytics';

class Dashboard extends React.Component {
  componentWillMount() {
    Analytics.page();
  }

  render() {
    const { counts } = this.props;
    const renderCountStat = (stat, i) => {
      const countStat = (
        <div key={i} className={`stat status-${stat.phase}-text`}>
          <Link to={`/urls?phase=${stat.phase}`} className={`status-${stat.phase}-text`}>
            <div className="stat-count">{stat.count || 0}</div>
            <div className="stat-label">{stat.label}</div>
          </Link>
        </div>
      );
      return countStat;
    };

    return (
      <div id="dashboard" className="dashboard">
        <div className="info">
          <h1 className="title">Harvesting <Link to="/urls">{counts.not_crawlable} of {counts.all}</Link> Proposed URLs</h1>
          <div className="stats">
            {[
              { phase: 'research', label: 'researching', count: counts.research },
              { phase: 'harvest', label: 'harvesting', count: counts.harvest },
              { phase: 'bag', label: 'bagging', count: counts.bag },
              { phase: 'describe', label: 'describing', count: counts.describe },
              { phase: 'done', label: 'complete', count: counts.done },
            ].map(renderCountStat)}
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  counts: PropTypes.object,
};

Dashboard.defaultProps = {
};

export default createContainer(() => {
  Meteor.subscribe('urls');

  const phaseCounter = function phaseCounter(phase) {
    return Urls.find(phaseSelector(phase)).count();
  };

  const counts = {
    all: phaseCounter('all'),
    crawlable: phaseCounter('crawlable'),
    not_crawlable: phaseCounter('not_crawlable'),
    research: phaseCounter('research'),
    harvest: phaseCounter('harvest'),
    bag: phaseCounter('bag'),
    describe: phaseCounter('describe'),
    done: phaseCounter('done'),
  };

  // @todo Move this to a proper test class once we get testing in the app.
  // eslint-disable-next-line no-console
  console.log('Crawlable/not crawlable check', counts.crawlable + counts.not_crawlable === counts.all ? 'passes' : 'fails');
  // eslint-disable-next-line no-console
  console.log('Phase totals check', counts.crawlable + counts.research + counts.harvest + counts.bag + counts.describe + counts.done === counts.all ? 'passes' : 'fails');

  return {
    currentUser: Meteor.user(),
    counts,
  };
}, Dashboard);
