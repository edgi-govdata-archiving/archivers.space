import React, { PropTypes } from 'react';

const ProgressBar = ({ progress }) => {
  const progressBar = (
    <div className="progressBar">
      <div className="bar" style={{ width: `${progress}%` }} />
    </div>
  );
  return progressBar;
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
};

ProgressBar.defaultProps = {
};

export default ProgressBar;
