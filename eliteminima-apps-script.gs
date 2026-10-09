/* ============================================================
   Elite Minima – The Surgical Speciality Clinic
   Google Apps Script — handles every form on the site with proper routing

   Two payload shapes arrive at this one webhook:

     /api/leads     -> { formType:'lead', sheetTab, timestamp, name, phone,
                         email, area (the concern picked), callDate, callTime, address,
                         duration, branch, source, medium, campaign, pageUrl }

     /api/feedback  -> { formType:'feedback', sheetTab, timestamp, name, email,
                         phone, rating (1–5 from the /review stars, blank if
                         they skipped it), suggestions, source, pageUrl }

   /review shows a 5-star rating. 4–5 goes straight to the Google review page;
   1–3 is routed to /client-feedback with ?rating=N, which is why Feedback rows
   carry a Rating column.

   Routing is on `formType`. If it is missing the script sniffs the payload
   (`suggestions` / a "feedback" source) and otherwise falls back to Leads, so a
   hand-rolled or legacy POST is never silently dropped.

   There are four lead forms, each with its own tab, chosen by `sheetTab`:
     "Elite Minima Piles Leads"         — the piles landing page at /piles
     "Elite Minima General Leads"       — the general page at /
     "Elite Minima Gynecomastia Leads"  — the page at /gynecomastia
     "Elite Minima Circumcision Leads"  — the page at /circumcision
   The names come from lib/forms.ts; an unrecognised one falls back to the piles
   tab. All four tabs share one column layout.

   NOTE: the booking forms collect name, phone, email, concern and a preferred
   callback date + time (separate native pickers). Address and Duration are kept
   as columns because lib/sheets.ts still sends them — Duration is now always
   blank (the general form's symptom question was removed).

   ⚠️  If a "thereshape Leads" tab exists from the previous build, run
   migrateLegacyLeadsTab() once after pasting this code. It copies those rows
   into "Elite Minima Piles Leads" in the new column order. Safe to run twice.

   ── SETUP ────────────────────────────────────────────────────
     1. Open the Google Sheet → Extensions → Apps Script.
     2. Delete anything already there, paste this whole file, Save.
     3. Run quickSetup() and authorise when prompted.
     4. Deploy → New deployment → type "Web app"
          Execute as:      Me
          Who has access:  Anyone     ← REQUIRED. The site posts anonymously;
                                        anything else returns a Google sign-in
                                        page and every write fails silently.
     5. Copy the /exec URL into .env as:
          GOOGLE_SHEETS_URL=https://script.google.com/macros/s/…/exec

   ── RE-DEPLOYING AFTER AN EDIT ───────────────────────────────
     Deploy → Manage deployments → pencil → Version: "New version" → Deploy.
     Saving the code alone does NOT update the live /exec URL.
   ============================================================ */

// ── Get or create spreadsheet reference ──────────────────────────────────────
function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {
    Logger.log('No active spreadsheet found, creating/opening by ID...');
  }

  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId);
    } catch (e) {
      Logger.log('Could not open spreadsheet by ID: ' + e.message);
    }
  }

  Logger.log('Creating a new spreadsheet...');
  var created = SpreadsheetApp.create('Elite Minima - Leads');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', created.getId());
  Logger.log('New spreadsheet created with ID: ' + created.getId());
  return created;
}

// ── Authorize function ──────────────────────────────────────────────────────
function authorize() {
  var ss = getSpreadsheet();
  Logger.log('Authorized: ' + ss.getName());
  Logger.log('Spreadsheet ID: ' + ss.getId());
  return ss;
}

// ── Web App entry points ────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'Elite Minima API is live',
      tabs: LEAD_TABS.concat([FEEDBACK_TAB]),
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────────────────────
//  BRAND  — sampled from the Elite Minima logo
// ─────────────────────────────────────────────────────────────────────────────

var GREEN  = '#17743C';  // wordmark green — Leads header
var PURPLE = '#513E98';  // EM monogram purple — Feedback header
var INK    = '#0E1626';
var ZEBRA  = '#F4F7F5';
var HAIRLINE = '#E5E7EF';

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _styleHeader(sheet, colCount, bgColor) {
  if (!sheet) return;
  try {
    sheet.getRange(1, 1, 1, colCount)
         .setBackground(bgColor || GREEN)
         .setFontColor('#ffffff')
         .setFontWeight('bold')
         .setFontSize(11)
         .setHorizontalAlignment('center')
         .setVerticalAlignment('middle');
  } catch (e) {
    Logger.log('Error styling header: ' + e.message);
  }
}

function styleRow(sheet, rowIndex, colCount) {
  if (!sheet) return;
  try {
    var row = sheet.getRange(rowIndex, 1, 1, colCount);
    row.setBackground(rowIndex % 2 === 0 ? ZEBRA : '#ffffff')
       .setFontColor(INK)
       .setFontSize(10)
       .setVerticalAlignment('middle')
       .setHorizontalAlignment('left');
    sheet.setRowHeight(rowIndex, 36);
    row.setBorder(false, false, true, false, false, false,
                  HAIRLINE, SpreadsheetApp.BorderStyle.SOLID);
  } catch (e) {
    Logger.log('Error styling row ' + rowIndex + ': ' + e.message);
  }
}

function _applyWidths(sheet, widths) {
  widths.forEach(function (w, i) {
    try { sheet.setColumnWidth(i + 1, w); } catch (e) {}
  });
}

// Write the header row WITHOUT clobbering data. If row 1 isn't already the
// header (e.g. the sheet was created without one), insert a fresh row on top
// so no existing data is lost.
function _ensureHeaderRow(sheet, headers) {
  var a1 = String(sheet.getRange(1, 1).getValue()).trim().toLowerCase();
  if (a1 !== String(headers[0]).toLowerCase()) {
    if (sheet.getLastRow() >= 1) sheet.insertRowBefore(1);
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  COLUMN DEFINITIONS  (single source of truth per tab)
//  Tab names must match LEADS_TAB / FEEDBACK_TAB in lib/sheets.ts.
// ─────────────────────────────────────────────────────────────────────────────

var LEADS_TAB         = 'Elite Minima Piles Leads';
var GENERAL_LEADS_TAB = 'Elite Minima General Leads';
var GYN_LEADS_TAB     = 'Elite Minima Gynecomastia Leads';
var CIRC_LEADS_TAB    = 'Elite Minima Circumcision Leads';
var FEEDBACK_TAB      = 'Elite Minima Feedback';

// One tab per lead form. The names must match lib/forms.ts, which is what the
// site sends as `sheetTab`. Every tab shares the layout below: the general,
// gynecomastia and circumcision forms ask for a treatment or concern rather
// than a symptom, which lands in Concern just the same, and leave Duration
// blank as the piles form already does.
//
// Everything else in this file derives from this array — sheet creation,
// reformatting, verification and the doGet status response — so adding a tab
// here is the only edit a new form needs. Re-deploy afterwards: saving the code
// alone does not update the live /exec URL, and until it does the new form's
// rows keep landing in the piles tab.
var LEAD_TABS = [LEADS_TAB, GENERAL_LEADS_TAB, GYN_LEADS_TAB, CIRC_LEADS_TAB];

var LEADS_HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Concern',
                     'Preferred Date', 'Preferred Time', 'Address', 'Duration',
                     'Branch', 'Source', 'Medium', 'Campaign', 'Page URL'];
var LEADS_WIDTHS  = [175, 160, 130, 210, 180, 130, 130, 200, 140, 160, 130, 120, 150, 300];

// Which lead tab a submission belongs in. Anything unrecognised — a legacy
// POST, a hand-rolled one — falls back to the piles tab, which is where every
// lead went before there was a second form. Never silently dropped.
function _leadTabFor(data) {
  var wanted = String((data && (data.sheetTab || data.formName)) || '').trim().toLowerCase();
  for (var i = 0; i < LEAD_TABS.length; i++) {
    if (LEAD_TABS[i].toLowerCase() === wanted) return LEAD_TABS[i];
  }
  return LEADS_TAB;
}

var FEEDBACK_HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Rating',
                        'Suggestions', 'Source', 'Page URL'];
var FEEDBACK_WIDTHS  = [175, 160, 130, 210, 80, 440, 210, 300];

// ─────────────────────────────────────────────────────────────────────────────
//  SHEET CREATORS  (with proper spreadsheet reference)
// ─────────────────────────────────────────────────────────────────────────────

// `tabName` defaults to the piles tab so existing calls read unchanged.
function createLeadsSheet(ss, tabName) {
  var tab = tabName || LEADS_TAB;
  try {
    if (!ss) ss = getSpreadsheet();

    var existingSheet = ss.getSheetByName(tab);
    if (existingSheet) {
      Logger.log(tab + ' already exists');
      return existingSheet;
    }

    var s = ss.insertSheet(tab);
    s.appendRow(LEADS_HEADERS);
    _styleHeader(s, LEADS_HEADERS.length, GREEN);
    _applyWidths(s, LEADS_WIDTHS);
    s.setRowHeight(1, 42);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, LEADS_HEADERS.length).createFilter();
    Logger.log('Created ' + tab);
    return s;
  } catch (e) {
    Logger.log('Error creating ' + tab + ': ' + e.message);
    throw e;
  }
}

function createFeedbackSheet(ss) {
  try {
    if (!ss) ss = getSpreadsheet();

    var existingSheet = ss.getSheetByName(FEEDBACK_TAB);
    if (existingSheet) {
      Logger.log(FEEDBACK_TAB + ' already exists');
      return existingSheet;
    }

    var s = ss.insertSheet(FEEDBACK_TAB);
    s.appendRow(FEEDBACK_HEADERS);
    _styleHeader(s, FEEDBACK_HEADERS.length, PURPLE);
    _applyWidths(s, FEEDBACK_WIDTHS);
    s.setRowHeight(1, 42);
    s.setFrozenRows(1);
    s.getRange(1, 1, 1, FEEDBACK_HEADERS.length).createFilter();
    Logger.log('Created ' + FEEDBACK_TAB);
    return s;
  } catch (e) {
    Logger.log('Error creating ' + FEEDBACK_TAB + ': ' + e.message);
    throw e;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  doPost  — runs on every form submission
//  Appends ONE new row only. All existing rows untouched.
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    if (!e || !e.postData) {
      return _json({ error: 'No data received' });
    }

    var data = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet();
    var ts = data.timestamp ||
             new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var source = data.source || data.pageUrl || 'Elite Minima – Website Form';

    var sheet, nextRow;

    Logger.log('Processing submission: ' + JSON.stringify(data));

    // ── 1. Client feedback ───────────────────────────────────
    //    `formType` is authoritative. The two fallbacks below cover a POST made
    //    without it: `suggestions` is unique to the feedback form.
    var isFeedback =
      String(data.formType || '').toLowerCase() === 'feedback' ||
      !!data.suggestions ||
      (data.sheetTab && String(data.sheetTab).toLowerCase().indexOf('feedback') !== -1) ||
      (data.source && String(data.source).toLowerCase().indexOf('feedback') !== -1);

    if (isFeedback) {
      sheet = ss.getSheetByName(FEEDBACK_TAB) || createFeedbackSheet(ss);
      nextRow = sheet.getLastRow() + 1;
      sheet.appendRow([
        ts,
        data.name || '',
        data.phone || '',
        data.email || '',
        data.rating || '',          // 1–5 from /review, blank if they skipped it
        data.suggestions || '',
        source,
        data.pageUrl || ''
      ]);
      styleRow(sheet, nextRow, FEEDBACK_HEADERS.length);
      sheet.getRange(nextRow, 3).setHorizontalAlignment('center');          // Phone
      sheet.getRange(nextRow, 5).setHorizontalAlignment('center');          // Rating
      sheet.getRange(nextRow, 6).setWrap(true).setVerticalAlignment('top'); // Suggestions
      Logger.log('Feedback saved to row: ' + nextRow);
      return _json({ success: true, tab: FEEDBACK_TAB, row: nextRow });
    }

    // ── 2. Booking leads (default) ───────────────────────────
    //    One tab per form: the piles landing page and the general page each
    //    have their own, picked from `sheetTab`.
    var leadTab = _leadTabFor(data);
    sheet = ss.getSheetByName(leadTab) || createLeadsSheet(ss, leadTab);
    nextRow = sheet.getLastRow() + 1;

    sheet.appendRow([
      ts,
      data.name || '',
      data.phone || '',
      data.email || '',
      data.area || data.concern || '',   // `area` is what lib/sheets.ts sends
      data.callDate || '',               // ISO yyyy-mm-dd, so Sheets sorts it
      data.callTime || '',               // readable, e.g. "3:30 PM"
      data.address || '',
      data.duration || '',
      data.branch || 'Elite Minima Clinic',
      data.source || 'direct',
      data.medium || '',
      data.campaign || '',
      data.pageUrl || ''
    ]);

    styleRow(sheet, nextRow, LEADS_HEADERS.length);
    sheet.getRange(nextRow, 3).setHorizontalAlignment('center'); // Phone
    sheet.getRange(nextRow, 6).setHorizontalAlignment('center'); // Preferred Date
    sheet.getRange(nextRow, 7).setHorizontalAlignment('center'); // Preferred Time

    Logger.log('Lead saved to ' + leadTab + ' row: ' + nextRow);
    return _json({ success: true, tab: leadTab, row: nextRow });

  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString());
    return _json({ error: err.toString() });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  TEST FUNCTIONS  — each mirrors the exact payload its route sends
// ─────────────────────────────────────────────────────────────────────────────

function _mockPost(payload) {
  payload.timestamp = payload.timestamp ||
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  var result = doPost({ postData: { contents: JSON.stringify(payload) } });
  Logger.log('Result: ' + result.getContent());
}

function testLead() {
  _mockPost({
    formType: 'lead',
    sheetTab: LEADS_TAB,
    name: 'Test Lead',
    phone: '9876543210',
    email: 'test.lead@example.com',
    area: 'Bleeding',
    callDate: '2026-08-12',
    callTime: '10:30 AM',
    address: '',
    duration: '',
    branch: 'Elite Minima Clinic',
    source: 'google',
    medium: 'cpc',
    campaign: 'piles-search',
    pageUrl: 'https://eliteminima.in/'
  });
}

function testLeadDirect() {
  // A lead with no UTMs — what an organic visitor produces.
  _mockPost({
    formType: 'lead',
    sheetTab: LEADS_TAB,
    name: 'Organic Lead Test',
    phone: '9123456780',
    email: 'organic@example.com',
    area: 'Swelling or Lump',
    callDate: '2026-08-14',
    callTime: '4:15 PM',
    branch: 'Elite Minima Clinic',
    source: 'direct',
    pageUrl: 'https://eliteminima.in/'
  });
}

function testGeneralLead() {
  // The /general form: a treatment rather than a symptom, and no Duration.
  _mockPost({
    formType: 'lead',
    sheetTab: GENERAL_LEADS_TAB,
    formName: GENERAL_LEADS_TAB,
    name: 'General Page Test',
    phone: '9812345670',
    email: 'general@example.com',
    area: 'Gynecomastia',
    callDate: '2026-08-13',
    callTime: '11:00 AM - 12:00 PM',
    address: 'Anna Nagar',
    branch: 'Elite Minima Clinic — General',
    source: 'google',
    medium: 'cpc',
    campaign: 'general-search',
    pageUrl: 'https://eliteminima.in/general'
  });
}

function testGynLead() {
  // The /gynecomastia form: name, phone, email, address, the concern picked
  // from the dropdown, and an hour-long callback slot. No Duration — that
  // question does not exist on this form.
  _mockPost({
    formType: 'lead',
    sheetTab: GYN_LEADS_TAB,
    formName: GYN_LEADS_TAB,
    name: 'Gynecomastia Page Test',
    phone: '9845612370',
    email: 'gyneco@example.com',
    area: 'Puffy or enlarged chest',
    callDate: '2026-08-15',
    callTime: '5:00 PM - 6:00 PM',
    address: 'Mogappair',
    duration: '',
    branch: 'Elite Minima Clinic — Gynecomastia',
    source: 'google',
    medium: 'cpc',
    campaign: 'gynecomastia-search',
    pageUrl: 'https://eliteminima.in/gynecomastia'
  });
}

function testCircumcisionLead() {
  // The /circumcision form: name, phone, email, address, the concern picked
  // from the dropdown, and an hour-long callback slot — the same shape as the
  // gynecomastia form. No Duration; that question does not exist on it.
  _mockPost({
    formType: 'lead',
    sheetTab: CIRC_LEADS_TAB,
    formName: CIRC_LEADS_TAB,
    name: 'Circumcision Page Test',
    phone: '9500091428',
    email: 'circumcision@example.com',
    area: 'Pain',
    callDate: '2026-08-16',
    callTime: '3:00 PM - 4:00 PM',
    address: 'Kilpauk',
    duration: '',
    branch: 'Elite Minima Clinic — Circumcision',
    source: 'google',
    medium: 'cpc',
    campaign: 'circumcision-search',
    pageUrl: 'https://eliteminima.in/circumcision'
  });
}

function testFeedback() {
  _mockPost({
    formType: 'feedback',
    sheetTab: FEEDBACK_TAB,
    name: 'Feedback Test',
    phone: '9876543210',
    email: 'test.feedback@example.com',
    rating: 3,
    suggestions: 'The consultation was thorough, but the waiting time was longer than I expected.',
    source: 'Elite Minima — Client Feedback',
    pageUrl: 'https://eliteminima.in/client-feedback'
  });
}

function testFeedbackWithoutFormType() {
  // Proves the fallback: no formType, but `suggestions` still routes it right.
  _mockPost({
    name: 'Fallback Routing Test',
    phone: '9000000000',
    email: 'fallback@example.com',
    suggestions: 'Posted without formType — should still land in the Feedback tab.'
  });
}

function testAll() {
  testLead();
  testLeadDirect();
  testGeneralLead();
  testGynLead();
  testCircumcisionLead();
  testFeedback();
  testFeedbackWithoutFormType();
  listSheets();
}

function testCreateSheets() {
  try {
    var ss = getSpreadsheet();
    LEAD_TABS.forEach(function (t) { createLeadsSheet(ss, t); });
    createFeedbackSheet(ss);
    Logger.log('Sheets created successfully');
    listSheets();
  } catch (e) {
    Logger.log('Error creating sheets: ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function listSheets() {
  try {
    var ss = getSpreadsheet();
    var sheets = ss.getSheets();
    Logger.log('=== Sheets in ' + ss.getName() + ' ===');
    sheets.forEach(function (sheet) {
      Logger.log('  - ' + sheet.getName() + ' (rows: ' + sheet.getLastRow() + ')');
    });
  } catch (e) {
    Logger.log('Error listing sheets: ' + e.message);
  }
}

function setupSheets() {
  try {
    var ss = getSpreadsheet();
    Logger.log('Setting up sheets in: ' + ss.getName());
    Logger.log('Spreadsheet URL: ' + ss.getUrl());

    LEAD_TABS.forEach(function (t) { createLeadsSheet(ss, t); });
    createFeedbackSheet(ss);

    // Make sure existing tabs pick up any new columns / headers.
    reformatLeadsSheet();
    reformatFeedbackSheet();

    listSheets();
    Logger.log('setupSheets complete.');
    Logger.log('Spreadsheet ID: ' + ss.getId());
  } catch (e) {
    Logger.log('setupSheets failed: ' + e.message);
  }
}

// Reformats every lead tab, or just the one named.
function reformatLeadsSheet(tabName) {
  if (!tabName) {
    LEAD_TABS.forEach(function (t) { reformatLeadsSheet(t); });
    return;
  }

  try {
    var ss = getSpreadsheet();
    var s = ss.getSheetByName(tabName);
    if (!s) {
      Logger.log(tabName + ' not found. Creating...');
      s = createLeadsSheet(ss, tabName);
      if (!s) return;
    }

    _ensureHeaderRow(s, LEADS_HEADERS);
    _styleHeader(s, LEADS_HEADERS.length, GREEN);
    _applyWidths(s, LEADS_WIDTHS);
    s.setRowHeight(1, 42);
    s.setFrozenRows(1);

    var filter = s.getFilter();
    if (filter) filter.remove();
    s.getRange(1, 1, 1, LEADS_HEADERS.length).createFilter();

    var last = s.getLastRow();
    for (var i = 2; i <= last; i++) {
      styleRow(s, i, LEADS_HEADERS.length);
      s.getRange(i, 3).setHorizontalAlignment('center');
      s.getRange(i, 6).setHorizontalAlignment('center');
      s.getRange(i, 7).setHorizontalAlignment('center');
    }
    Logger.log(tabName + ' reformatted. Rows: ' + last);
  } catch (e) {
    Logger.log('Error reformatting ' + tabName + ': ' + e.message);
  }
}

function reformatFeedbackSheet() {
  try {
    var ss = getSpreadsheet();
    var s = ss.getSheetByName(FEEDBACK_TAB);
    if (!s) {
      Logger.log(FEEDBACK_TAB + ' not found. Creating...');
      s = createFeedbackSheet(ss);
      if (!s) return;
    }

    _ensureHeaderRow(s, FEEDBACK_HEADERS);
    _styleHeader(s, FEEDBACK_HEADERS.length, PURPLE);
    _applyWidths(s, FEEDBACK_WIDTHS);
    s.setRowHeight(1, 42);
    s.setFrozenRows(1);

    var filter = s.getFilter();
    if (filter) filter.remove();
    s.getRange(1, 1, 1, FEEDBACK_HEADERS.length).createFilter();

    var last = s.getLastRow();
    for (var i = 2; i <= last; i++) {
      styleRow(s, i, FEEDBACK_HEADERS.length);
      s.getRange(i, 3).setHorizontalAlignment('center');
      s.getRange(i, 5).setHorizontalAlignment('center');
      s.getRange(i, 6).setWrap(true).setVerticalAlignment('top');
    }
    Logger.log(FEEDBACK_TAB + ' reformatted. Rows: ' + last);
  } catch (e) {
    Logger.log('Error reformatting ' + FEEDBACK_TAB + ': ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ONE-TIME MIGRATION  — pull rows out of the previous build's tab
//
//  The earlier script wrote to a "thereshape Leads" tab in this order:
//    [Timestamp, Name, Phone, Email, Address, Concern, Duration,
//     Preferred Call Time, Branch, Source, Medium, Campaign, Page URL]
//
//  The new "Elite Minima Piles Leads" order promotes the fields the form actually
//  collects and demotes the two it doesn't:
//    [Timestamp, Name, Phone, Email, Concern, Preferred Call Time, Address,
//     Duration, Branch, Source, Medium, Campaign, Page URL]
//
//  Rows are APPENDED to the new tab; the legacy tab is left untouched so you
//  can verify before deleting it. Safe to run more than once — already-copied
//  rows are skipped by matching Timestamp + Phone.
// ─────────────────────────────────────────────────────────────────────────────

var LEGACY_LEADS_TAB = 'thereshape Leads';

// Old legacy index for each new column, in new-column order.
// -1 = the legacy layout had no equivalent (it stored one combined call-time
// field, which now maps to Preferred Time; Preferred Date is left blank).
var LEGACY_TO_NEW = [0, 1, 2, 3, 5, -1, 7, 4, 6, 8, 9, 10, 11, 12];

function migrateLegacyLeadsTab() {
  try {
    var ss = getSpreadsheet();
    var legacy = ss.getSheetByName(LEGACY_LEADS_TAB);
    if (!legacy) {
      Logger.log('No "' + LEGACY_LEADS_TAB + '" tab found — nothing to migrate.');
      return;
    }

    var lastRow = legacy.getLastRow();
    if (lastRow < 2) {
      Logger.log('"' + LEGACY_LEADS_TAB + '" has no data rows — nothing to migrate.');
      return;
    }

    var target = ss.getSheetByName(LEADS_TAB) || createLeadsSheet(ss);

    // Build a set of rows already present, keyed on Timestamp + Phone.
    var seen = {};
    var targetLast = target.getLastRow();
    if (targetLast >= 2) {
      var existing = target.getRange(2, 1, targetLast - 1, LEADS_HEADERS.length).getValues();
      existing.forEach(function (r) { seen[String(r[0]) + '|' + String(r[2])] = true; });
    }

    var width = Math.max(legacy.getLastColumn(), LEGACY_TO_NEW.length);
    var rows = legacy.getRange(2, 1, lastRow - 1, width).getValues();

    var copied = 0, skipped = 0;
    rows.forEach(function (r) {
      var key = String(r[0]) + '|' + String(r[2]);
      if (seen[key]) { skipped++; return; }

      var mapped = LEGACY_TO_NEW.map(function (oldIdx) {
        if (oldIdx < 0) return '';
        var v = r[oldIdx];
        return (v === undefined || v === null) ? '' : v;
      });

      var nextRow = target.getLastRow() + 1;
      target.appendRow(mapped);
      styleRow(target, nextRow, LEADS_HEADERS.length);
      target.getRange(nextRow, 3).setHorizontalAlignment('center');
      target.getRange(nextRow, 6).setHorizontalAlignment('center');
      target.getRange(nextRow, 7).setHorizontalAlignment('center');
      seen[key] = true;
      copied++;
    });

    Logger.log('Migration complete. Copied: ' + copied + ', already present: ' + skipped);
    Logger.log('The "' + LEGACY_LEADS_TAB + '" tab was left in place — delete it once you have checked the data.');
  } catch (e) {
    Logger.log('Error migrating legacy leads: ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  DEPLOYMENT CHECK
// ─────────────────────────────────────────────────────────────────────────────

function checkDeployment() {
  try {
    Logger.log('=== Elite Minima - Apps Script Check ===');
    var ss = getSpreadsheet();
    Logger.log('Spreadsheet: ' + ss.getName());
    Logger.log('Spreadsheet ID: ' + ss.getId());
    Logger.log('Spreadsheet URL: ' + ss.getUrl());

    listSheets();

    var required = LEAD_TABS.concat([FEEDBACK_TAB]);
    var missing = [];
    required.forEach(function (name) {
      var exists = ss.getSheetByName(name) !== null;
      Logger.log(name + ' exists: ' + exists);
      if (!exists) missing.push(name);
    });

    if (missing.length) {
      Logger.log('WARNING: missing tabs -> ' + missing.join(', '));
      Logger.log('Run setupSheets() to create them.');
    }

    if (ss.getSheetByName(LEGACY_LEADS_TAB)) {
      Logger.log('NOTE: legacy "' + LEGACY_LEADS_TAB + '" tab is present.');
      Logger.log('Run migrateLegacyLeadsTab() to bring its rows across.');
    }

    Logger.log('=== Check Complete ===');
    Logger.log('To deploy: Deploy > New Deployment > Web App');
    Logger.log('Set "Execute as" to "Me" and "Who has access" to "Anyone"');
    Logger.log('Copy the Web App URL into .env as GOOGLE_SHEETS_URL');

    return {
      success: true,
      spreadsheetName: ss.getName(),
      spreadsheetId: ss.getId(),
      spreadsheetUrl: ss.getUrl(),
      missingTabs: missing
    };
  } catch (e) {
    Logger.log('Check failed: ' + e.message);
    return { success: false, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  FIX FOR THE "insertSheet" ERROR - Run this first!
// ─────────────────────────────────────────────────────────────────────────────

function fixSpreadsheetBinding() {
  try {
    Logger.log('=== Fixing Spreadsheet Binding ===');

    var ss = getSpreadsheet();

    if (ss) {
      Logger.log('Successfully connected to spreadsheet: ' + ss.getName());
      Logger.log('   ID: ' + ss.getId());
      Logger.log('   URL: ' + ss.getUrl());

      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

      LEAD_TABS.forEach(function (t) { createLeadsSheet(ss, t); });
      createFeedbackSheet(ss);

      // Apply the latest column layout to any pre-existing tabs.
      reformatLeadsSheet();
      reformatFeedbackSheet();

      listSheets();

      Logger.log('=== Fix Complete ===');
      Logger.log('Your script is now properly bound to the spreadsheet.');
    } else {
      Logger.log('Could not connect to or create a spreadsheet.');
      Logger.log('Create a Google Sheet manually, then:');
      Logger.log('1. Extensions > Apps Script');
      Logger.log('2. Paste this code into the editor');
      Logger.log('3. Run fixSpreadsheetBinding() again');
    }
  } catch (e) {
    Logger.log('Error: ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  QUICK SETUP - Run this if everything else fails
// ─────────────────────────────────────────────────────────────────────────────

function quickSetup() {
  Logger.log('=== Quick Setup - Run this first ===');
  fixSpreadsheetBinding();
  Logger.log('=== Quick Setup Complete ===');
  Logger.log('Next steps:');
  Logger.log('1. Click Deploy > New Deployment > Web App');
  Logger.log('2. Set "Execute as" to "Me"');
  Logger.log('3. Set "Who has access" to "Anyone"');
  Logger.log('4. Click Deploy and copy the Web App URL');
  Logger.log('5. Add the URL to your .env as GOOGLE_SHEETS_URL');
  Logger.log('6. If a "' + LEGACY_LEADS_TAB + '" tab exists, run migrateLegacyLeadsTab()');
}
