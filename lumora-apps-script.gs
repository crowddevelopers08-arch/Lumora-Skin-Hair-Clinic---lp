/* ============================================================
   Lumora Skin & Hair Clinic
   Google Apps Script — receives CLIENT FEEDBACK only

   One payload shape arrives at this webhook, from /api/feedback:

     { formType:'feedback', sheetTab, timestamp, name, email, phone,
       rating (1–5 from the /review stars, blank if they skipped it),
       suggestions, source, pageUrl }

   /review shows a 5-star rating. 4–5 goes straight to the Google review page;
   1–3 is routed to /client-feedback?rating=N, and that form posts here — which
   is why rows carry a Rating column.

   Anything that is not feedback (no formType 'feedback' and no `suggestions`)
   is rejected with an error, so stray lead POSTs never pollute the sheet.

   ── SETUP ────────────────────────────────────────────────────
     1. Create a Google Sheet → Extensions → Apps Script.
     2. Delete anything already there, paste this whole file, Save.
     3. Run quickSetup() and authorise when prompted.
     4. Deploy → New deployment → type "Web app"
          Execute as:      Me
          Who has access:  Anyone     ← REQUIRED. The site posts anonymously;
                                        anything else returns a Google sign-in
                                        page and every write fails silently.
     5. Copy the /exec URL into .env as:
          GOOGLE_SHEETS_URL=https://script.google.com/macros/s/…/exec
     6. Run testFeedback() to drop a sample row in the Feedback tab.

   ── RE-DEPLOYING AFTER AN EDIT ───────────────────────────────
     Deploy → Manage deployments → pencil → Version: "New version" → Deploy.
     Saving the code alone does NOT update the live /exec URL.
   ============================================================ */

// ─────────────────────────────────────────────────────────────────────────────
//  CONFIG  — tab name must match FEEDBACK_TAB in lib/sheets.ts
// ─────────────────────────────────────────────────────────────────────────────

var FEEDBACK_TAB = 'Lumora Feedback';

var FEEDBACK_HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Rating',
                        'Suggestions', 'Source', 'Page URL'];
var FEEDBACK_WIDTHS  = [175, 160, 130, 210, 80, 440, 210, 300];

// Brand — sampled from the Lumora logo
var ESPRESSO = '#412519';  // wordmark brown — header
var INK      = '#2E1A11';
var ZEBRA    = '#FBF5EE';  // faint cream
var HAIRLINE = '#E6D6C5';

// ── Get or create spreadsheet reference ──────────────────────────────────────
function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {
    Logger.log('No active spreadsheet found, opening by ID...');
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
  var created = SpreadsheetApp.create('Lumora Skin & Hair Clinic - Feedback');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', created.getId());
  Logger.log('New spreadsheet created with ID: ' + created.getId());
  return created;
}

// ── Web App entry points ────────────────────────────────────────────────────
function doGet(e) {
  return _json({
    status: 'Lumora feedback API is live',
    tabs: [FEEDBACK_TAB],
    timestamp: new Date().toISOString()
  });
}

// Appends ONE new row per submission. Existing rows are never touched.
function doPost(e) {
  // Two submissions landing together would otherwise race on getLastRow().
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData) {
      return _json({ error: 'No data received' });
    }

    var data = JSON.parse(e.postData.contents);

    var isFeedback =
      String(data.formType || '').toLowerCase() === 'feedback' || !!data.suggestions;
    if (!isFeedback) {
      Logger.log('Rejected non-feedback submission: ' + JSON.stringify(data));
      return _json({ error: 'This endpoint only accepts client feedback' });
    }

    lock.waitLock(10000);

    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(FEEDBACK_TAB) || createFeedbackSheet(ss);
    var nextRow = sheet.getLastRow() + 1;
    var ts = data.timestamp ||
             new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    sheet.appendRow([
      ts,
      data.name || '',
      data.phone || '',
      data.email || '',
      data.rating || '',          // 1–5 from /review, blank if they skipped it
      data.suggestions || '',
      data.source || 'Lumora — Client Feedback',
      data.pageUrl || ''
    ]);
    _styleDataRow(sheet, nextRow);

    Logger.log('Feedback saved to row: ' + nextRow);
    return _json({ success: true, tab: FEEDBACK_TAB, row: nextRow });

  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString());
    return _json({ error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _styleHeader(sheet) {
  sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length)
       .setBackground(ESPRESSO)
       .setFontColor('#ffffff')
       .setFontWeight('bold')
       .setFontSize(11)
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);
  sheet.setFrozenRows(1);
}

function _styleDataRow(sheet, rowIndex) {
  try {
    var row = sheet.getRange(rowIndex, 1, 1, FEEDBACK_HEADERS.length);
    row.setBackground(rowIndex % 2 === 0 ? ZEBRA : '#ffffff')
       .setFontColor(INK)
       .setFontSize(10)
       .setVerticalAlignment('middle')
       .setHorizontalAlignment('left');
    row.setBorder(false, false, true, false, false, false,
                  HAIRLINE, SpreadsheetApp.BorderStyle.SOLID);
    sheet.setRowHeight(rowIndex, 36);
    sheet.getRange(rowIndex, 3).setHorizontalAlignment('center');          // Phone
    sheet.getRange(rowIndex, 5).setHorizontalAlignment('center');          // Rating
    sheet.getRange(rowIndex, 6).setWrap(true).setVerticalAlignment('top'); // Suggestions
  } catch (e) {
    Logger.log('Error styling row ' + rowIndex + ': ' + e.message);
  }
}

// Write the header row WITHOUT clobbering data: if row 1 isn't already the
// header, insert a fresh row on top so nothing is lost.
function _ensureHeaderRow(sheet) {
  var a1 = String(sheet.getRange(1, 1).getValue()).trim().toLowerCase();
  if (a1 !== FEEDBACK_HEADERS[0].toLowerCase() && sheet.getLastRow() >= 1) {
    sheet.insertRowBefore(1);
  }
  sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length).setValues([FEEDBACK_HEADERS]);
}

function _resetFilter(sheet) {
  var filter = sheet.getFilter();
  if (filter) filter.remove();
  sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), FEEDBACK_HEADERS.length).createFilter();
}

// ─────────────────────────────────────────────────────────────────────────────
//  SHEET SETUP
// ─────────────────────────────────────────────────────────────────────────────

function createFeedbackSheet(ss) {
  if (!ss) ss = getSpreadsheet();

  var existing = ss.getSheetByName(FEEDBACK_TAB);
  if (existing) return existing;

  var s = ss.insertSheet(FEEDBACK_TAB);
  s.appendRow(FEEDBACK_HEADERS);
  _styleHeader(s);
  FEEDBACK_WIDTHS.forEach(function (w, i) { s.setColumnWidth(i + 1, w); });
  _resetFilter(s);
  Logger.log('Created ' + FEEDBACK_TAB);
  return s;
}

// Re-applies headers, widths and row styling to an existing Feedback tab.
function reformatFeedbackSheet() {
  var ss = getSpreadsheet();
  var s = ss.getSheetByName(FEEDBACK_TAB) || createFeedbackSheet(ss);

  _ensureHeaderRow(s);
  _styleHeader(s);
  FEEDBACK_WIDTHS.forEach(function (w, i) { s.setColumnWidth(i + 1, w); });
  _resetFilter(s);

  var last = s.getLastRow();
  for (var i = 2; i <= last; i++) _styleDataRow(s, i);
  Logger.log(FEEDBACK_TAB + ' reformatted. Rows: ' + last);
}

// Run this first, from the Apps Script editor.
function quickSetup() {
  var ss = getSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  createFeedbackSheet(ss);
  reformatFeedbackSheet();

  Logger.log('=== Lumora setup complete ===');
  Logger.log('Spreadsheet: ' + ss.getName() + '  (' + ss.getUrl() + ')');
  Logger.log('Next: Deploy > New deployment > Web app');
  Logger.log('      Execute as "Me", Who has access "Anyone"');
  Logger.log('      Copy the /exec URL into .env as GOOGLE_SHEETS_URL');
}

// ─────────────────────────────────────────────────────────────────────────────
//  TESTS  — mirror the exact payload /api/feedback sends
// ─────────────────────────────────────────────────────────────────────────────

function _mockPost(payload) {
  var result = doPost({ postData: { contents: JSON.stringify(payload) } });
  Logger.log('Result: ' + result.getContent());
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

function testRejectsLead() {
  // Should log an error and write nothing — this endpoint is feedback-only.
  _mockPost({ formType: 'lead', name: 'Lead Test', phone: '9000000000' });
}
