/* eslint-disable class-methods-use-this, meteor/no-session, react/jsx-no-bind, jsx-a11y/no-static-element-interactions, react/no-array-index-key */
import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import Urls from '../../api/urls';

class UrlSearch extends React.Component {
  handleQueryChange(e) {
    Session.set('urls.query', e.target.value);
  }

  handleClearQuery() {
    Session.set('urls.query', '');
  }

  handleSelect(i) {
    this.props.onSelect(this.props.results[i]);
  }

  render() {
    const { query, results, selected, disabled } = this.props;

    if (disabled) {
      return (
        <div id="urlSearch">
          <input type="text" value={query} disabled={disabled} onChange={this.handleQueryChange.bind(this)} />
        </div>
      );
    }

    return (
      <div id="urlSearch">
        <input type="text" value={query} disabled={disabled} onChange={this.handleQueryChange.bind(this)} />
        { query ? <a onClick={this.handleClearQuery.bind(this)}>x</a> : undefined }
        <div className="results">
          {results.map((r, i) => {
            const result = (
              <div key={i} className={(selected === i) ? 'selected result' : 'result'}>
                <a className="primary" onClick={this.handleSelect.bind(this, i)}>{r.uuid}</a>
                <p>{r.url}</p>
              </div>
            );
            return result;
          })}
        </div>
      </div>
    );
  }
}

UrlSearch.propTypes = {
  query: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  results: PropTypes.array,
  selected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  disabled: PropTypes.bool,
};

UrlSearch.defaultProps = {
  results: [],
  selected: -1,
  query: '',
};

export default createContainer(() => {
  Meteor.subscribe('urls');

  const query = Session.get('urls.query');
  let results = [];
  if (query) {
    results = Urls.find({ url: new RegExp(`.*${query}.*`, 'i') }, { limit: 5 }).fetch();
  }

  return {
    query,
    results,
    selected: -1,
  };
}, UrlSearch);
