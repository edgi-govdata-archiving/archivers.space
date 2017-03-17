import React, { PropTypes } from 'react';

const TableItems = (props) => {
  const { data } = props;

  return (
    <tbody className="items">
      {data.map((item, i) => <props.component index={i + 1} key={item._id} data={item} />)}
    </tbody>
  );
};

TableItems.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  component: PropTypes.func.isRequired,
};

export default TableItems;
