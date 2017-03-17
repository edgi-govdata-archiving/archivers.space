import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { status } from '../../../selectors/url';

const UrlItem = ({ index, data }) => {
  const url = data;
  const phase = status(url);
  const concatUrl = (u) => {
    const concatResult = (u.length < 50) ? u : `${u.slice(0, 50)}...`;
    return concatResult;
  };

  return (
    <tr className="url item">
      <td>{index}</td>
      <td>{url.priority}</td>
      <td><Link to={`/urls/${url.uuid}`} className={`status-${phase}-text`}>{url.uuid || 'no uuid'}</Link></td>
      <td><a className="target" href={url.url} target="_blank" rel="noopener noreferrer">{concatUrl(url.url)}</a></td>
      <td>{url.lock_username}</td>
    </tr>
  );
};

UrlItem.propTypes = {
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};

UrlItem.defaultProps = {
};

export default UrlItem;
