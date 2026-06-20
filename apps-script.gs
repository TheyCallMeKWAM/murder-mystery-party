// ════════════════════════════════════════════════════════════
//  Who Dunnit? — Google Apps Script Backend
//
//  Setup / Update:
//  1. Paste this into Extensions > Apps Script (replace all)
//  2. Click Deploy > Manage deployments
//  3. Click the pencil icon on your existing deployment
//  4. Set Version to "New version" → click Deploy
//  (URL stays the same — no need to update the HTML files)
// ════════════════════════════════════════════════════════════

const SHEET_NAME = 'Verdicts';

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const param = (e && e.parameter) || {};

  try {

    // ── Save a new submission ──────────────────────────────
    if (param.data) {
      const data = JSON.parse(param.data);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['submittedAt','name','murderer','because','bestDressed','bestActor','wealth']);
      }
      sheet.appendRow([
        data.submittedAt || new Date().toISOString(),
        data.name        || '',
        data.murderer    || '',
        data.because     || '',
        data.bestDressed || '',
        data.bestActor   || '',
        data.wealth      || ''
      ]);
      return out({ ok: true });
    }

    // ── Clear all verdicts ─────────────────────────────────
    if (param.action === 'clear') {
      const sheet = ss.getSheetByName(SHEET_NAME);
      if (sheet) sheet.clearContents();
      return out({ ok: true });
    }

    // ── Read all verdicts ──────────────────────────────────
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) return out([]);
    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const records = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[String(h)] = row[i]; });
      return obj;
    });
    records.reverse(); // newest first
    return out(records);

  } catch (err) {
    return out({ error: String(err) });
  }
}

function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) { return out({ ok: true }); }
