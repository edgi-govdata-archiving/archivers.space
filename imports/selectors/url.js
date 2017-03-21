
// locks that have been checked for longer than two weeks are considered stale
export function lockIsStale(url = {}) {
  // Calculate the threshold date for making url locks available for release.
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return (url.lock_time <= twoWeeksAgo);
}

export function formatMetadataJSON(url, user = {}) {
  // const agency = Agencies.get(url.agency);
  // return url;

  return {
    url: url.url,
    'Individual source or seed URL': url.url,
    UUID: url.uuid,
    // 'id_agency' : agency.agency_id,
    // 'id_subagency': agency.subagency_id,
    // 'id_org': '',  // TODO
    // 'id_suborg': '',  // TODO
    'Institution facilitating the data capture creation and packaging': '',  // TODO,
    'Date of capture': new Date().toString(),
    // 'Federal agency data acquired from': agency.name,
    'Name of resource': '',  // TODO
    title: url.title,
    'File formats contained in package': url.file_types,
    'Type(s) of content in package': url.significance,
    'Free text description of capture process': url.harvest_method,
    'Name of package creator': user.username || '',  // TODO
    significance: url.significance,
    recommended_approach: url.recommended_approach,
  };
}

export function status(url) {
  if (!url) {
    return '';
  }
  if (url.merged) {
    return 'merged';
  }
  if (url.crawlable) {
    return 'crawlable';
  }
  if (!url.research_done) {
    return 'research';
  }
  if (!url.harvest_done) {
    return 'harvest';
  }
  if (!url.bag_done) {
    return 'bag';
  }
  if (!url.describe_done) {
    return 'describe';
  }
  return 'done';
}

export function phaseNum(url) {
  if (!url) {
    return -3;
  }
  if (url.crawlable) {
    return -2;
  }
  if (url.merged) {
    return -1;
  }
  if (!url.research_done) {
    return 0;
  }
  if (!url.harvest_done) {
    return 1;
  }
  if (!url.bag_done) {
    return 2;
  }
  if (!url.describe_done) {
    return 3;
  }
  return 4;
}

export function phaseSelector(phase) {
  switch (phase) {
    case 'all':
      return {};

    case 'merged':
      return {
        merged: { $exists: true },
      };

    case 'crawlable':
      return {
        crawlable: { $eq: true },
      };

    case 'not_crawlable':
      return {
        crawlable: { $eq: false },
      };

    case 'research':
      return {
        crawlable: { $eq: false },
        research_done: { $eq: false },
      };

    case 'harvest':
      return {
        crawlable: { $eq: false },
        research_done: { $eq: true },
        harvest_done: { $eq: false },
      };

    case 'bag':
      return {
        crawlable: { $eq: false },
        research_done: { $eq: true },
        harvest_done: { $eq: true },
        bag_done: { $eq: false },
      };

    case 'describe':
      return {
        crawlable: { $eq: false },
        research_done: { $eq: true },
        harvest_done: { $eq: true },
        bag_done: { $eq: true },
        describe_done: { $eq: false },
      };

    case 'done':
      return {
        crawlable: { $eq: false },
        research_done: { $eq: true },
        harvest_done: { $eq: true },
        bag_done: { $eq: true },
        describe_done: { $eq: true },
      };

    default:
      return {};
  }
}

export function uploadPath(url) {
  return `remote/${url.uuid}.zip`;
}
