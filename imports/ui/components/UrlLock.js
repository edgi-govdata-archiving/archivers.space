import React from 'react';

import { lockIsStale } from '../../selectors/url';

const UrlLock = ({ currentUser, admin, url, handleLock, handleUnlock }) => {
  // check for a stale lock (if locked)
  const stale = lockIsStale(url);

  // Evaluate URL status.
  const status = url.locked ? `Checked out by ${url.lock_username} at ${url.lock_time.toString()}` : 'Not checked out';

  // Present appropriate URL actions for the given situation.
  let actions;
  if (!currentUser && !url.locked) {
    // Nudge the user to sign in and get to work.
    actions = <i>sign in to check out this url</i>;
  } else if (currentUser && !url.locked) {
    // If the user is signed in and the url is not locked, it's fair game.
    actions = <button className="btn btn-primary" onClick={handleLock}>Checkout this URL</button>;
  } else if (currentUser && url.locked && (currentUser._id === url.locked)) {
    // Users are allowed to release urls they checked out themselves.
    actions = <button className="btn btn-primary" onClick={handleUnlock}>Checkin this URL</button>;
  } else if (currentUser && url.locked && admin && stale) {
    // Admin users can release URLs that have been locked for two weeks.
    actions = <button className="btn btn-warning" onClick={handleUnlock}>Force-Checkin this URL</button>;
  } else if (currentUser && url.locked && admin && !stale) {
    actions = <i>This URL has been checked out for less than two weeks.</i>;
  }

  const urlLock = (
    <div className="url-lock">
      <div className="url-lock__status">URL Status: {status}</div>
      <div className="url-lock__actions">{actions}</div>
    </div>
  );
  return urlLock;
};

export default UrlLock;
