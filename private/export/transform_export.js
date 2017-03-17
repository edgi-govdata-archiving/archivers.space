var fs = require('fs');

if (!process.argv[2]) {
  console.warn("expected json file for import");
  process.exit();
}
if (!process.argv[3]) {
  console.warn("expected filename for saving");
  process.exit();
}

var data = require('./' + process.argv[2]);

// assuming data is an array of objects, this fun returns
function mirrorKeys(obj) {
  return Object.keys(obj).reduce((r,a) => {
    r[a] = a;
    return r;
  }, {})
}

function formatEntries(data) {
	return data.map(d => {
    return {
      uuid : d.uuid,
      url : d.url,
      createdAt : d.createdAt ? d.createdAt.$date : "",
      priority : d.priority,
      title : d.title,
      significance : d.significance,
      recommended_approach: d.recommended_approach,
      file_types : d.file_types,
      estimated_size: d.estimated_size,
      harvest_done : d.harvest_done,
      research_done : d.research_done,
      bag_done : d.bag_done,
      done : d.done,
      crawlable : d.crawlable,
      has_dynamic_content : d.has_dynamic_content,
      s3_url : d.s3_url,
      bag_url : d.bag_url,
      ckan_url : d.ckan_url,
      seed_notes : d.seed_notes,
      has_vis : d.has_vis,
      is_ftp : d.is_ftp,
      has_api : d.has_api,
      has_direct_download : d.has_direct_download,
      has_form : d.has_form,
      warc_made : d.warc_made,
      packaged : d.packaged,
      uploaded : d.uploaded,
      spot_checked : d.spot_checked,
    }
	});
}

var dataWithHeader = [mirrorKeys(data[0])].concat(formatEntries(data));

fs.writeFile(process.argv[3], JSON.stringify(dataWithHeader));