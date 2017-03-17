import React from 'react';

const UrlLock = ({ currentUser, admin, url, handleLock, handleUnlock }) => {
  // Calculate the threshold date for making url locks available for release.
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

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
  } else if (currentUser && url.locked && admin && url.lock_time <= twoWeeksAgo) {
    // Admin users can release URLs that have been locked for two weeks.
    actions = <button className="btn btn-primary" onClick={handleUnlock}>Checkin this URL</button>;
  } else if (currentUser && url.locked && admin && url.lock_time > twoWeeksAgo) {
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
