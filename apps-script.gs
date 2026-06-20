// ════════════════════════════════════════════════════════════
//  Who Dunnit? — Google Apps Script Backend
//
//  Setup:
//  1. Open your Google Sheet
//  2. Click Extensions > Apps Script
//  3. Paste this entire file, replacing any existing code
//  4. Click Deploy > New deployment
//     - Type: Web app
//     - Execute as: Me
//     - Who has access: Anyone
//  5. Click Deploy, copy the Web app URL
//  6. Paste that URL into SCRIPT_URL in index.html and host.html
// ════════════════════════════════════════════════════════════

const SHEET_NAME = 'Verdicts';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['submittedAt', 'name', 'murderer', 'because', 'bestDressed', 'bestActor', 'wealth']);
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
  } catch (err) {}

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[String(h)] = row[i]; });
      return obj;
    });

    data.reverse(); // newest first

    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
