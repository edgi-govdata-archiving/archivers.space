import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const UserItem = ({ index, data }) => {
  const user = data;
  return (
    <tr className="user item">
      <td>{index}</td>
      <td><Link to={`/users/${user.username}`}>{user.username}</Link></td>
    </tr>
  );
};

UserItem.propTypes = {
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};

UserItem.defaultProps = {
};

export default UserItem;
