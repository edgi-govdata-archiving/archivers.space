import React from 'react';

const Alerts = () => {
  let alert = '';
  if (process.env.NODE_ENV === 'development') {
    alert = (
      <div className="alert alert-warning" role="alert">
        This is a development instance, probably on your localhost or something.
      </div>
    );
  } else if (process.env.NODE_ENV === 'staging') {
    alert = (
      <div className="alert alert-warning" role="alert">
        You are using the staging instance, for testing and teaching only.
        Use the <a href="https://www.archivers.space">production instance</a> for real work.
      </div>
    );
  }
  return alert;
};

export default Alerts;
