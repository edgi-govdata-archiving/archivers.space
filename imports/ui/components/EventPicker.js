import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Events from '../../api/events';

const EventPicker = ({ events, value, name, onChange }) => {
  const handleEventChange = (e) => {
    if (e.target.value === '') {
      onChange(name, undefined);
      return;
    }
    onChange(name, events.find(event => event._id === e.target.value));
  };

  return (
    <select className="form-control" value={value} onChange={handleEventChange}>
      <option>none</option>
      {events.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
    </select>
  );
};

EventPicker.propTypes = {
  // eslint-disable-next-line react/require-default-props
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  events: PropTypes.array,
};

EventPicker.defaultProps = {
  events: [],
  value: undefined,
};

export default createContainer(() => {
  Meteor.subscribe('events');

  return {
    events: Events.find({}).fetch(),
  };
}, EventPicker);
