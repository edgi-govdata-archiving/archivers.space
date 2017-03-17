import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const AgencyItem = ({ index, data }) => {
  const agency = data;
  return (
    <tr className="agency item">
      <td>{index}</td>
      <td>{agency.acronym}</td>
      <td><Link to={`/agencies/${agency._id}`}>{agency.name || 'unnamed agency'}</Link></td>
    </tr>
  );
};

AgencyItem.propTypes = {
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};

AgencyItem.defaultProps = {
};

export default AgencyItem;
