/* ============================================================
   Lumora Skin & Hair Clinic
   Google Apps Script — LP LEADS + CLIENT FEEDBACK + META AUDIENCE SYNC

   One web-app deployment, two payloads, two tabs:

   1) LEADS — landing page form (/) via /api/leads → lib/sheets.ts
        { formType:'lead', timestamp, name, phone, area (concern),
          source, medium, campaign, term, content, gclid, fbclid,
          formId (form1 hero | form2 map section | form3 pop-up), pageUrl }
        → tab "Lumora LP Leads"   (= LUMORA_LEADS_FORM in lib/forms.ts)

   2) FEEDBACK — /client-feedback via /api/feedback
        { formType:'feedback', timestamp, name, email, phone,
          rating (1–5), suggestions, source, pageUrl }
        → tab "Lumora Feedback"   (= FEEDBACK_TAB in lib/sheets.ts)

   Rows are written BY HEADER NAME, not column position, so you can add your
   own columns (e.g. "Notes", "Called By") or reorder them without breaking
   submissions. Every lead gets a Lead ID, which the Meta sync uses to find
   its row again even if the sheet has been sorted or filtered.

   ── SETUP ────────────────────────────────────────────────────
     1. Open the Google Sheet → Extensions → Apps Script.
     2. Delete everything there, paste this whole file, Save.
     3. Run quickSetup() and authorise when prompted.
        → creates/formats both tabs and the "Lumora" menu.
     4. (Optional) Run removeUnusedTabs() to delete every other tab.
     5. Deploy → New deployment → type "Web app"
          Execute as:      Me
          Who has access:  Anyone     ← REQUIRED, or every write fails.
     6. Put the /exec URL in .env and in the hosting env vars as
          GOOGLE_SHEETS_URL=https://script.google.com/macros/s/…/exec
     7. Run testLead() / testFeedback() to drop sample rows.

   ── META CUSTOM AUDIENCE SYNC ─────────────────────────────────
     Every 5 minutes, new leads are pushed to a Meta customer-list Custom
     Audience — phone, first name, last name and country, SHA-256 hashed
     before they leave Google. The "Meta Audience" column shows each row's
     state: Added / Duplicate / Skipped / Error (errors retry next run).

     Project Settings → Script Properties:
       META_ACCESS_TOKEN   System-user token with ads_management
       META_AUDIENCE_ID    ID of a Customer List custom audience
     Then run setupMetaAudienceSync() once (installs the trigger + first sync).

   ── RE-DEPLOYING AFTER AN EDIT ───────────────────────────────
     Deploy → Manage deployments → Edit → Version: "New version" → Deploy.
     Saving alone does NOT update the live /exec URL; editing the existing
     deployment keeps the same URL.
   ============================================================ */

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────────────────────────────────────

var LEADS_TAB    = 'Lumora LP Leads';   // = LUMORA_LEADS_FORM in lib/forms.ts
var FEEDBACK_TAB = 'Lumora Feedback';   // = FEEDBACK_TAB in lib/sheets.ts

// removeUnusedTabs() deletes every tab NOT listed here.
var KEEP_TABS = [LEADS_TAB, FEEDBACK_TAB];

// Comma-separated addresses to email on every new lead. '' disables it.
var NOTIFY_EMAILS = '';

var META_COLUMN = 'Meta Audience';

var LEAD_HEADERS = ['Timestamp', 'Lead ID', 'Name', 'Phone', 'Concern', 'Status',
                    'Repeat?', 'Form Position', 'Source', 'Medium', 'Campaign',
                    'Term', 'Content', 'GCLID', 'FBCLID', 'Page URL', META_COLUMN];
var LEAD_WIDTHS  = [175, 130, 170, 120, 190, 150,
                    80, 120, 110, 100, 170,
                    150, 130, 150, 150, 300, 210];

var FEEDBACK_HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Rating',
                        'Suggestions', 'Source', 'Page URL'];
var FEEDBACK_WIDTHS  = [175, 160, 120, 210, 80, 440, 200, 300];

var LEAD_STATUSES = ['New', 'Contacted', 'Not Reachable', 'Appointment Booked',
                     'Visited', 'Not Interested', 'Junk'];
var STATUS_COLOURS = {
  'New':                '#FFF4D6',
  'Contacted':          '#E3EEFB',
  'Not Reachable':      '#F3E8FF',
  'Appointment Booked': '#DDF4E4',
  'Visited':            '#BFE8CC',
  'Not Interested':     '#F1F1F1',
  'Junk':               '#FBE0DE'
};

// Where each lead form sits on the page (LeadForm `id` prop).
var FORM_POSITIONS = { form1: 'Hero', form2: 'Map section', form3: 'Pop-up' };

// Brand — sampled from the Lumora logo
var ESPRESSO = '#412519';  // header
var INK      = '#2E1A11';
var ZEBRA    = '#FBF5EE';
var HAIRLINE = '#E6D6C5';

var TABS = {};
TABS[LEADS_TAB]    = { headers: LEAD_HEADERS,     widths: LEAD_WIDTHS,
                       center: ['Lead ID', 'Phone', 'Status', 'Repeat?', 'Form Position'], wrap: [] };
TABS[FEEDBACK_TAB] = { headers: FEEDBACK_HEADERS, widths: FEEDBACK_WIDTHS,
                       center: ['Phone', 'Rating'], wrap: ['Suggestions'] };

// ─────────────────────────────────────────────────────────────────────────────
//  SPREADSHEET
// ─────────────────────────────────────────────────────────────────────────────

function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}

  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  throw new Error('No spreadsheet: open this script from the Sheet (Extensions → Apps Script) and run quickSetup().');
}

// ─────────────────────────────────────────────────────────────────────────────
//  WEB APP
// ─────────────────────────────────────────────────────────────────────────────

function doGet() {
  return _json({ status: 'Lumora LP API is live', tabs: KEEP_TABS, timestamp: new Date().toISOString() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) return _json({ error: 'Empty request body' });

    var data;
    try { data = JSON.parse(e.postData.contents); }
    catch (parseErr) { return _json({ error: 'Body is not valid JSON' }); }

    var type = String(data.formType || data.action || '').toLowerCase();
    if (!type) type = data.suggestions ? 'feedback' : 'lead';
    if (type !== 'lead' && type !== 'feedback') return _json({ error: 'Unknown formType: ' + type });

    // Serialises writes with each other and with the Meta sync's read/write phases.
    lock.waitLock(30000);
    var ss = getSpreadsheet();
    return _json(type === 'feedback' ? _saveFeedback(ss, data) : _saveLead(ss, data));

  } catch (err) {
    Logger.log('doPost error: ' + err);
    return _json({ error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  WRITERS
// ─────────────────────────────────────────────────────────────────────────────

function _saveLead(ss, data) {
  var name  = _str(data.name);
  var phone = _phone(data.phone);
  if (!name || !phone) return { error: 'Lead is missing name or phone' };

  var sheet = _getOrCreateTab(ss, LEADS_TAB);
  var headers = _ensureHeaders(sheet, LEAD_HEADERS);
  var repeat = _valueExists(sheet, headers, 'Phone', phone);
  var formId = _str(data.formId);
  var leadId = _newLeadId();

  var res = _appendByHeaders(sheet, LEADS_TAB, {
    'Timestamp':     _str(data.timestamp) || _now(),
    'Lead ID':       leadId,
    'Name':          name,
    'Phone':         phone,
    'Concern':       _str(data.area || data.concern),
    'Status':        'New',
    'Repeat?':       repeat ? 'Yes' : '',
    'Form Position': FORM_POSITIONS[formId] || formId,
    'Source':        _str(data.source) || 'direct',
    'Medium':        _str(data.medium),
    'Campaign':      _str(data.campaign),
    'Term':          _str(data.term),
    'Content':       _str(data.content),
    'GCLID':         _str(data.gclid),
    'FBCLID':        _str(data.fbclid),
    'Page URL':      _str(data.pageUrl),
    'Meta Audience': ''               // filled in by syncMetaAudience()
  });

  _notifyLead(ss, res.values, res.row);
  Logger.log('Lead ' + leadId + ' saved to row ' + res.row);
  return { success: true, tab: LEADS_TAB, row: res.row, leadId: leadId, repeat: repeat };
}

function _saveFeedback(ss, data) {
  var sheet = _getOrCreateTab(ss, FEEDBACK_TAB);
  var rating = Number(data.rating);

  var res = _appendByHeaders(sheet, FEEDBACK_TAB, {
    'Timestamp':   _str(data.timestamp) || _now(),
    'Name':        _str(data.name),
    'Phone':       _phone(data.phone),
    'Email':       _str(data.email),
    'Rating':      rating >= 1 && rating <= 5 ? rating + ' / 5' : '',
    'Suggestions': _str(data.suggestions),
    'Source':      _str(data.source) || 'Lumora — Client Feedback',
    'Page URL':    _str(data.pageUrl)
  });

  Logger.log('Feedback saved to row ' + res.row);
  return { success: true, tab: FEEDBACK_TAB, row: res.row };
}

// ─────────────────────────────────────────────────────────────────────────────
//  HEADER-NAME HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _headersOf(sheet) {
  if (sheet.getLastColumn() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) {
    return String(h).trim();
  });
}

// Returns the header row, writing it on an empty tab and appending any of
// `wanted` that an older tab is missing. Never removes or moves your columns.
function _ensureHeaders(sheet, wanted) {
  var headers = _headersOf(sheet);
  if (!headers.length || headers.every(function (h) { return !h; })) {
    sheet.getRange(1, 1, 1, wanted.length).setValues([wanted]);
    _styleHeader(sheet, wanted.length);
    return wanted.slice();
  }
  var missing = wanted.filter(function (h) { return headers.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
    _styleHeader(sheet, headers.length);
  }
  return headers;
}

function _appendByHeaders(sheet, tab, valueMap) {
  var headers = _ensureHeaders(sheet, TABS[tab].headers);
  var values = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(valueMap, h) ? valueMap[h] : '';
  });
  var row = sheet.getLastRow() + 1;
  // Plain text, so Sheets never turns 9876543210 into 9.88E+09 or re-parses dates.
  sheet.getRange(row, 1, 1, headers.length).setNumberFormat('@').setValues([values]);
  _styleDataRow(sheet, tab, row, headers);
  return { row: row, headers: headers, values: _zip(headers, values) };
}

function _col(headers, name) {
  return headers.indexOf(name) + 1;  // 0 when missing
}

function _valueExists(sheet, headers, name, value) {
  var c = _col(headers, name);
  if (!c || sheet.getLastRow() < 2) return false;
  return !!sheet.getRange(2, c, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(value)).matchEntireCell(true).findNext();
}

function _zip(headers, values) {
  var o = {};
  headers.forEach(function (h, i) { o[h] = values[i]; });
  return o;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function _str(v) {
  return v === null || v === undefined ? '' : String(v).trim();
}

function _digits(v) {
  return _str(v).replace(/\D/g, '');
}

// Stored as the 10-digit Indian mobile; +91 / 91 / 0 prefixes are dropped.
function _phone(v) {
  var d = _digits(v);
  if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
  if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
  return d;
}

function _now() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy, hh:mm:ss a');
}

function _newLeadId() {
  return 'LUM-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd-HHmmss') + '-' +
         Math.floor(Math.random() * 1296).toString(36).toUpperCase();
}

function _notifyLead(ss, v, row) {
  if (!NOTIFY_EMAILS) return;
  try {
    var lines = LEAD_HEADERS.filter(function (h) { return v[h] && h !== META_COLUMN; })
                            .map(function (h) { return h + ': ' + v[h]; });
    MailApp.sendEmail({
      to: NOTIFY_EMAILS,
      subject: 'New Lumora lead: ' + v['Name'] + ' (' + v['Phone'] + ')' + (v['Repeat?'] ? ' — repeat' : ''),
      body: lines.join('\n') + '\n\nOpen: ' + ss.getUrl() + '#gid=' +
            ss.getSheetByName(LEADS_TAB).getSheetId() + '&range=A' + row
    });
  } catch (e) {
    Logger.log('Lead email failed: ' + e.message);  // never blocks the write
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  STYLING
// ─────────────────────────────────────────────────────────────────────────────

function _styleHeader(sheet, colCount) {
  sheet.getRange(1, 1, 1, colCount)
       .setBackground(ESPRESSO).setFontColor('#ffffff').setFontWeight('bold').setFontSize(11)
       .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sheet.setRowHeight(1, 42);
  sheet.setFrozenRows(1);
}

function _styleDataRow(sheet, tab, row, headers) {
  try {
    var cfg = TABS[tab];
    sheet.getRange(row, 1, 1, headers.length)
         .setBackground(row % 2 === 0 ? ZEBRA : '#ffffff').setFontColor(INK).setFontSize(10)
         .setVerticalAlignment('middle').setHorizontalAlignment('left')
         .setBorder(false, false, true, false, false, false, HAIRLINE, SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeight(row, 36);
    cfg.center.forEach(function (n) { var c = _col(headers, n); if (c) sheet.getRange(row, c).setHorizontalAlignment('center'); });
    cfg.wrap.forEach(function (n) {
      var c = _col(headers, n);
      if (c) { sheet.getRange(row, c).setWrap(true).setVerticalAlignment('top'); sheet.autoResizeRows(row, 1); }
    });
  } catch (e) {
    Logger.log('Styling row ' + row + ' failed: ' + e.message);
  }
}

// Status dropdown + colours, on whichever column is headed "Status".
function _applyStatusRules(sheet, headers) {
  var c = _col(headers, 'Status');
  if (!c) return;
  var range = sheet.getRange(2, c, sheet.getMaxRows() - 1, 1);
  range.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(LEAD_STATUSES, true).setAllowInvalid(true).build());

  var rules = sheet.getConditionalFormatRules().filter(function (r) {
    return r.getRanges().every(function (rg) { return rg.getColumn() !== c; });
  });
  LEAD_STATUSES.forEach(function (s) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(s).setBackground(STATUS_COLOURS[s]).setRanges([range]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

function _resetFilter(sheet, colCount) {
  try {
    var f = sheet.getFilter();
    if (f) f.remove();
    sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), colCount).createFilter();
  } catch (e) {
    Logger.log('Filter skipped on ' + sheet.getName() + ': ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  TAB SETUP
// ─────────────────────────────────────────────────────────────────────────────

function _getOrCreateTab(ss, tab) {
  var s = ss.getSheetByName(tab);
  if (s) return s;
  s = ss.insertSheet(tab);
  var cfg = TABS[tab];
  var headers = _ensureHeaders(s, cfg.headers);
  cfg.widths.forEach(function (w, i) { s.setColumnWidth(i + 1, w); });
  _resetFilter(s, headers.length);
  if (tab === LEADS_TAB) _applyStatusRules(s, headers);
  Logger.log('Created tab ' + tab);
  return s;
}

function _reformatTab(tab) {
  var ss = getSpreadsheet();
  var s = _getOrCreateTab(ss, tab);
  var cfg = TABS[tab];
  var headers = _ensureHeaders(s, cfg.headers);
  _styleHeader(s, headers.length);
  cfg.headers.forEach(function (h, i) { var c = _col(headers, h); if (c) s.setColumnWidth(c, cfg.widths[i]); });
  _resetFilter(s, headers.length);
  if (tab === LEADS_TAB) _applyStatusRules(s, headers);
  var last = s.getLastRow();
  for (var r = 2; r <= last; r++) _styleDataRow(s, tab, r, headers);
  Logger.log(tab + ' reformatted (' + Math.max(last - 1, 0) + ' rows)');
}

function reformatLeadsSheet()    { _reformatTab(LEADS_TAB); }
function reformatFeedbackSheet() { _reformatTab(FEEDBACK_TAB); }

// Run this first, from the Apps Script editor.
function quickSetup() {
  var ss = getSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  reformatLeadsSheet();
  reformatFeedbackSheet();

  // A brand-new spreadsheet starts with an empty "Sheet1" — drop it.
  var blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
  ss.setActiveSheet(ss.getSheetByName(LEADS_TAB));
  ss.moveActiveSheet(1);

  Logger.log('=== Lumora setup complete: ' + ss.getUrl());
  Logger.log('Next: Deploy > New deployment > Web app (Execute as Me, Access Anyone)');
}

/**
 * Deletes every tab not in KEEP_TABS (old Elite Minima / test / default tabs).
 * Asks for confirmation when run from the sheet menu. Deleted tabs can be
 * recovered from File → Version history if needed.
 */
function removeUnusedTabs() {
  var ss = getSpreadsheet();
  _getOrCreateTab(ss, LEADS_TAB);  // a sheet must always keep at least one tab
  _getOrCreateTab(ss, FEEDBACK_TAB);

  var doomed = ss.getSheets().filter(function (s) { return KEEP_TABS.indexOf(s.getName()) === -1; });
  if (!doomed.length) { _say('No unused tabs — only ' + KEEP_TABS.join(' and ') + ' remain.'); return; }

  var names = doomed.map(function (s) { return s.getName(); });
  var ui = _ui();
  if (ui) {
    var answer = ui.alert('Remove unused tabs?',
      'This deletes ' + names.length + ' tab(s):\n\n' + names.join('\n') +
      '\n\nKept: ' + KEEP_TABS.join(', '), ui.ButtonSet.YES_NO);
    if (answer !== ui.Button.YES) return;
  }
  doomed.forEach(function (s) { ss.deleteSheet(s); });
  _say('Deleted ' + names.length + ' tab(s): ' + names.join(', '));
}

// ─────────────────────────────────────────────────────────────────────────────
//  MENU
// ─────────────────────────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Lumora')
    .addItem('Sync Meta audience now', 'syncMetaAudienceFromMenu')
    .addItem('Retry skipped / failed Meta rows', 'retryMetaAudienceFromMenu')
    .addSeparator()
    .addItem('Reformat tabs', 'quickSetup')
    .addItem('Remove unused tabs…', 'removeUnusedTabs')
    .addToUi();
}

function _ui() {
  try { return SpreadsheetApp.getUi(); } catch (e) { return null; }  // null in triggers / editor runs
}

function _say(msg) {
  Logger.log(msg);
  try { getSpreadsheet().toast(msg, 'Lumora', 8); } catch (e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
//  META CUSTOM AUDIENCE SYNC
// ─────────────────────────────────────────────────────────────────────────────

var META_GRAPH_VERSION = 'v21.0';
var META_SYNC_TRIGGER  = 'syncMetaAudience';
var META_BATCH_SIZE    = 5000;           // Meta accepts up to 10,000 per request
var META_SENDING_TTL   = 15 * 60 * 1000; // a "Sending" claim older than this is retried

/** Run once from the editor: checks settings, installs the 5-minute trigger, syncs. */
function setupMetaAudienceSync() {
  _metaSettings();
  removeMetaAudienceSync();
  ScriptApp.newTrigger(META_SYNC_TRIGGER).timeBased().everyMinutes(5).create();
  Logger.log('Trigger installed: ' + META_SYNC_TRIGGER + ' every 5 minutes');
  Logger.log(JSON.stringify(syncMetaAudience()));
}

function removeMetaAudienceSync() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === META_SYNC_TRIGGER) ScriptApp.deleteTrigger(t);
  });
}

function syncMetaAudienceFromMenu() {
  _say(_metaSummary(syncMetaAudience()));
}

/** Clears Skipped / Error cells (e.g. after fixing a number or the token) and syncs again. */
function retryMetaAudienceFromMenu() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = getSpreadsheet().getSheetByName(LEADS_TAB);
    var headers = sheet ? _headersOf(sheet) : [];
    var c = _col(headers, META_COLUMN);
    if (c && sheet.getLastRow() >= 2) {
      var range = sheet.getRange(2, c, sheet.getLastRow() - 1, 1);
      range.setValues(range.getValues().map(function (r) {
        var s = String(r[0]);
        return [s.indexOf('Skipped') === 0 || s.indexOf('Error') === 0 ? '' : r[0]];
      }));
    }
  } finally {
    lock.releaseLock();
  }
  syncMetaAudienceFromMenu();
}

/**
 * Pushes every lead not yet in the audience. Three short phases so the script
 * lock (which new form submissions also need) is never held during the call
 * to Meta:
 *   1. [locked]   claim unsent rows as "Sending…", mark Skipped / Duplicate
 *   2. [unlocked] POST hashed users to Meta
 *   3. [locked]   write Added / Error back, finding each row by its Lead ID
 */
function syncMetaAudience() {
  var settings = _metaSettings();
  var lock = LockService.getScriptLock();

  // ── Phase 1: claim ─────────────────────────────────────────────────────────
  if (!lock.tryLock(30000)) return { busy: true };
  var toSend = [], skipped = 0, duplicates = 0;
  try {
    var sheet = getSpreadsheet().getSheetByName(LEADS_TAB);
    if (!sheet || sheet.getLastRow() < 2) return { added: 0, failed: 0, skipped: 0, duplicates: 0 };

    var headers = _ensureHeaders(sheet, LEAD_HEADERS);
    var n = sheet.getLastRow() - 1;
    var values = sheet.getRange(2, 1, n, headers.length).getValues();
    var iId = _col(headers, 'Lead ID') - 1, iName = _col(headers, 'Name') - 1,
        iPhone = _col(headers, 'Phone') - 1, iMeta = _col(headers, META_COLUMN) - 1;

    var ids  = values.map(function (r) { return [r[iId]]; });
    var meta = values.map(function (r) { return [r[iMeta]]; });
    var now = Date.now();

    // Rows typed in by hand have no Lead ID yet — give them one.
    ids.forEach(function (r) { if (!String(r[0]).trim()) r[0] = _newLeadId(); });

    // Numbers already in (or on their way to) the audience aren't re-sent.
    var known = {};
    values.forEach(function (r, i) {
      var s = String(meta[i][0]);
      if (s.indexOf('Added') === 0 || (s.indexOf('Sending') === 0 && !_sendingExpired(s, now))) {
        var u = _metaUser(r[iName], r[iPhone]);
        if (u) known[u[0]] = true;
      }
    });

    values.forEach(function (r, i) {
      var s = String(meta[i][0]).trim();
      var pending = !s || s.indexOf('Error') === 0 || (s.indexOf('Sending') === 0 && _sendingExpired(s, now));
      if (!pending) return;

      var user = _metaUser(r[iName], r[iPhone]);
      if (!user)          { meta[i][0] = 'Skipped: no valid phone'; skipped++; return; }
      if (known[user[0]]) { meta[i][0] = 'Duplicate: already added'; duplicates++; return; }

      known[user[0]] = true;
      meta[i][0] = 'Sending ' + now;
      toSend.push({ id: String(ids[i][0]), user: user });
    });

    sheet.getRange(2, iId + 1, n, 1).setValues(ids);
    sheet.getRange(2, iMeta + 1, n, 1).setValues(meta);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  if (!toSend.length) return { added: 0, failed: 0, skipped: skipped, duplicates: duplicates };

  // ── Phase 2: send ──────────────────────────────────────────────────────────
  var labels = {}, added = 0, failed = 0;
  for (var start = 0; start < toSend.length; start += META_BATCH_SIZE) {
    var batch = toSend.slice(start, start + META_BATCH_SIZE);
    var label;
    try {
      var res = _audienceUsers(settings, batch.map(function (p) { return p.user; }));
      label = 'Added ' + _istNow();
      added += batch.length - (res.num_invalid_entries || 0);
    } catch (err) {
      label = 'Error: ' + String(err.message || err).slice(0, 200);
      failed += batch.length;
      Logger.log('Meta sync error: ' + err);
    }
    batch.forEach(function (p) { labels[p.id] = label; });
  }

  // ── Phase 3: record ────────────────────────────────────────────────────────
  lock.waitLock(30000);
  try {
    var sh = getSpreadsheet().getSheetByName(LEADS_TAB);
    var hd = _headersOf(sh);
    var m = sh.getLastRow() - 1;
    var idCol = sh.getRange(2, _col(hd, 'Lead ID'), m, 1).getValues();
    var metaRange = sh.getRange(2, _col(hd, META_COLUMN), m, 1);
    var metaCol = metaRange.getValues();
    idCol.forEach(function (r, i) {
      var id = String(r[0]);
      if (Object.prototype.hasOwnProperty.call(labels, id)) metaCol[i][0] = labels[id];
    });
    metaRange.setValues(metaCol);
  } finally {
    lock.releaseLock();
  }

  return { added: added, failed: failed, skipped: skipped, duplicates: duplicates };
}

function _sendingExpired(state, now) {
  var t = Number(String(state).replace(/\D/g, ''));
  return !t || now - t > META_SENDING_TTL;
}

function _metaSettings() {
  var p = PropertiesService.getScriptProperties();
  var token = p.getProperty('META_ACCESS_TOKEN');
  var audienceId = p.getProperty('META_AUDIENCE_ID');
  if (!token) throw new Error('Set the META_ACCESS_TOKEN script property first');
  if (!audienceId) throw new Error('Set the META_AUDIENCE_ID script property first');
  return { token: token, audienceId: audienceId };
}

/** [PHONE, FN, LN, COUNTRY], hashed per Meta's normalisation rules; null without a usable number. */
function _metaUser(name, phone) {
  var digits = _digits(phone).replace(/^0+/, '');
  if (digits.length === 10) digits = '91' + digits;  // stored without country code → India
  if (digits.length < 11 || digits.length > 15) return null;

  // Lowercase, no punctuation: "Dr. O'Neil" → "dr", "oneil"
  var parts = _str(name).toLowerCase().split(/\s+/).map(function (p) {
    return p.replace(/[.,'"`()\-_]/g, '');
  }).filter(Boolean);
  var fn = parts[0] || '';
  var ln = parts.length > 1 ? parts[parts.length - 1] : '';

  return [_sha256(digits), fn ? _sha256(fn) : '', ln ? _sha256(ln) : '', _sha256('in')];
}

function _audienceUsers(settings, users) {
  var url = 'https://graph.facebook.com/' + META_GRAPH_VERSION + '/' +
            encodeURIComponent(settings.audienceId) + '/users';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    payload: {
      access_token: settings.token,
      payload: JSON.stringify({ schema: ['PHONE', 'FN', 'LN', 'COUNTRY'], data: users })
    },
    muteHttpExceptions: true
  });
  var json = {};
  try { json = JSON.parse(res.getContentText()); } catch (ignore) {}
  if (res.getResponseCode() !== 200 || json.error) {
    throw new Error((json.error && json.error.message) || ('Meta HTTP ' + res.getResponseCode()));
  }
  return json;  // { audience_id, num_received, num_invalid_entries, ... }
}

function _sha256(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function _istNow() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'd MMM yyyy, h:mm a');
}

function _metaSummary(r) {
  if (r.busy) return 'Sheet is busy — try again in a moment.';
  return r.added + ' added to Meta audience' +
    (r.failed ? ', ' + r.failed + ' failed' : '') +
    (r.duplicates ? ', ' + r.duplicates + ' duplicate' : '') +
    (r.skipped ? ', ' + r.skipped + ' skipped (no valid phone)' : '');
}

// ─────────────────────────────────────────────────────────────────────────────
//  TESTS — mirror the exact payloads lib/sheets.ts sends
// ─────────────────────────────────────────────────────────────────────────────

function _mockPost(payload) {
  var result = doPost({ postData: { contents: JSON.stringify(payload) } });
  Logger.log('Result: ' + result.getContent());
}

function testLead() {
  _mockPost({
    formType: 'lead',
    sheetTab: LEADS_TAB,
    formName: LEADS_TAB,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name: 'Lead Test',
    phone: '9876543210',
    area: 'Hair Fall / Thinning',
    source: 'facebook',
    medium: 'paid',
    campaign: 'lumora-lp',
    term: '',
    content: 'carousel-1',
    gclid: '',
    fbclid: 'TEST-FBCLID',
    formId: 'form1',
    pageUrl: 'https://example.com/?utm_source=facebook&utm_medium=paid'
  });
}

function testFeedback() {
  _mockPost({
    formType: 'feedback',
    sheetTab: FEEDBACK_TAB,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name: 'Feedback Test',
    phone: '9876543210',
    email: 'test.feedback@example.com',
    rating: 3,
    suggestions: 'The consultation was thorough, but the waiting time was longer than I expected.',
    source: 'Lumora — Client Feedback',
    pageUrl: 'https://example.com/client-feedback?rating=3'
  });
}

/** Checks the Meta token + audience without uploading anyone. */
function testMetaConnection() {
  var s = _metaSettings();
  var res = UrlFetchApp.fetch('https://graph.facebook.com/' + META_GRAPH_VERSION + '/' +
    encodeURIComponent(s.audienceId) + '?fields=name,subtype,approximate_count_lower_bound&access_token=' +
    encodeURIComponent(s.token), { muteHttpExceptions: true });
  Logger.log(res.getResponseCode() + ' ' + res.getContentText());
}
