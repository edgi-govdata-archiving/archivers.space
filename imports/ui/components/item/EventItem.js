import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const EventItem = ({ index, data }) => {
  const event = data;

  return (
    <tr className="event item">
      <td>{index}</td>
      <td><Link to={`/events/${event._id}`}>{event.name || 'unnamed event'}</Link></td>
      <td>{event.start.toDateString()}</td>
      <td>{event.stop.toDateString()}</td>
    </tr>
  );
};

EventItem.propTypes = {
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
};

EventItem.defaultProps = {
};

export default EventItem;
