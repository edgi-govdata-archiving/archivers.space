// import { Roles } from 'meteor/alanning:roles';
// import { Mongo } from 'meteor/mongo';
// import { Meteor } from 'meteor/meteor';
// import { check } from 'meteor/check';
// import { Urls, newUrl } from './urls.js';

// const normalizeUrl = require('../libs/normalize-url');

// // TODO I should probably do this the 'Meteor' way.
// const GoogleSpreadsheet = require('google-spreadsheet');
// const async = require('async');

// const SheetIngests = new Mongo.Collection('sheetIngests');
// export default SheetIngests;

// let creds = { client_email: '', private_key: '' }, doc;

// // hard-coded earliest row we will ever automatically ingest
// let lastRowCount = 22300;

// if (Meteor.isServer) {
//   // Archivers Google Service Account credenitals, set up by @danielballan
//   if (process.env.GOOGLE_SERVICE_CLIENT_EMAIL && process.env.GOOGLE_SERVICE_PRIVATE_KEY) {
//     creds = {
//       client_email: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
//       private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     };
//   }

//   // This is the ID of the "EDGI URL Tracker with Agency Coding (Responses)"
//   // spreadsheet. It is not particularly sensitive: someone would need an
//   // invitation or our Google Service API key to access it.
//   if (process.env.INJEST_GOOGLE_SHEET_ID) {
//     doc = new GoogleSpreadsheet(process.env.INJEST_GOOGLE_SHEET_ID);
//   }

//   Meteor.publish('sheetIngests', () => {
//     return SheetIngests.find({});
//   });
// }

// function asyncGetNewRows(cb) {
//   if (!process.env.GOOGLE_SERVICE_CLIENT_EMAIL || !process.env.GOOGLE_SERVICE_PRIVATE_KEY || !process.env.INJEST_GOOGLE_SHEET_ID) {
//     return;
//   }

//   if (!Meteor.user()) {
//     throw new Meteor.Error('not-authorized');
//   }

//   let admin = false;
//   admin = Roles.userIsInRole(Meteor.user(), 'admin', Roles.GLOBAL_GROUP);
//   if (!admin) {
//     throw new Meteor.Error('not-authorized');
//   }

//   let sheet;
//   let newRows;
//   // @todo the linter doesn't recognize this variable in the arrow function
//   // scope below. investigate
//   // eslint-disable-next-line no-unused-vars
//   let rowCount;

//   async.series([
//     function setAuth(step) {
//       console.log('Authenticating with Google....');
//       doc.useServiceAccountAuth(creds, step);
//     },

//     function getInfoAndWorksheets(step) {
//       console.log('Authenticated.');
//       doc.getInfo((err, info) => {
//         if (err) {
//           console.log('getInfo errored:', err);
//         } else {
//           sheet = info.worksheets[0];
//           rowCount = sheet.rowCount;
//           step();
//         }
//       });
//     },

//     function getRows(step) {
//       sheet.getRows({
//         offset: lastRowCount,
//         limit: 1000,
//       }, (err, rows) => {
//         if (err) {
//           console.log('getRows errored:', err);
//         } else {
//           newRows = rows;
//         }
//         step();
//       });
//     }, function returnResult(step) {
//       if (cb) {
//         cb(undefined, newRows);
//       }
//       step();
//     },
//   ]); // end of async block
// }

// Meteor.methods({
//   'spreadsheetIngests.countNewRows': function spreadsheetIngestCountNewRows() {
//     // Find the last row we have ingested so far.
//     const lastEntry = SheetIngests.find({}, { sort: { created_at: -1 }, limit: 1 }).fetch()[0];
//     if (lastEntry) {
//       lastRowCount = lastEntry.rowCount;
//     }
//     // Downloading the rows is the only reliable way to count them.
//     // Google's rowCount includes blank rows and can be 1000s higher than
//     // the real number of rows.
//     const syncFunc = Meteor.wrapAsync(asyncGetNewRows);
//     const newRows = syncFunc(lastRowCount);
//     return newRows.length;
//   },

//   'spreadsheetIngests.ingest': function spreadsheetIngestIngest() {
//     // Find the last row we have ingested so far.
//     const lastEntry = SheetIngests.find({}, { sort: { created_at: -1 }, limit: 1 }).fetch()[0];
//     if (lastEntry) {
//       lastRowCount = lastEntry.rowCount;
//     }

//     // Download the next (up to) 1000 rows after lastRowCount.
//     const syncFunc = Meteor.wrapAsync(asyncGetNewRows);
//     console.log('Ingest will start from row', lastRowCount);
//     const newRows = syncFunc(lastRowCount);
//     const userId = Meteor.userId(); // included in all Urls ingested
//     const ingestId = SheetIngests.insert({
//       created_at: new Date(),
//       rowCount: newRows.length + lastRowCount,
//     });
//     console.log('Ingesting', newRows.length, 'rows....');

//     // This ingestId will be included in every Url document
//     // inserted as part of this ingest.
//     newRows.forEach((row) => {
//       let url = {
//         submitted_by_chrome_at: row.timestamp,
//         submitter_name: row.name,
//         submitter_email: row.emailaddress,
//         eventname: row.eventname,
//         title: row.title,
//         agency: row.agency,
//         url: row.url,
//         id_agency: row.agencyid,
//         id_subagency: row.subagencyid,
//         id_org: row.organizationid,
//         id_suborg: row.suborganizationid,
//         id_subprimer: row.subprimerid,
//         uncrawlable: row.uncrawlable,
//         has_vis: row.visualizationinteractive,
//         has_direct_download: row.files,
//         is_ftp: row.ftp,
//         seed_notes: row.comment,
//         has_api: row.database,
//         ingest_id: ingestId,
//       };
//       check(url.url, String);

//       url.url = normalizeUrl(url.url.trim());

//       const exists = Urls.findOne({ url: url.url });
//       if (exists) {
//         console.log('Skipping', url.url, 'as duplicate.');
//       } else {
//         Urls.insert(newUrl(url, userId));
//       }
//     });
//     console.log('Ingest complete.');
//   },
// });
