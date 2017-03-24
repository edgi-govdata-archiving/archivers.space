import React from 'react';

// EnvAlert renders a warning if the current environment isn't production
const EnvAlert = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return (
        <div className="alert alert-warning" role="alert">
          This is a development instance, probably on your localhost or something.
        </div>
      );
    case 'staging':
      return (
        <div className="alert alert-warning" role="alert">
          You are using the staging instance, for testing and teaching only.
          Use the <a href="https://www.archivers.space">production instance</a> for real work.
        </div>
      );
    default:
      // default to returning null (preventing render)
      // see: https://facebook.github.io/react/docs/conditional-rendering.html#preventing-component-from-rendering
      return null;
  }
};

export default EnvAlert;
