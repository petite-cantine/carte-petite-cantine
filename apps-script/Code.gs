// Google Apps Script : enregistre les collaborations validées dans la colonne « Validé » du Sheet.
// À coller dans Extensions > Apps Script du Google Sheet, puis Déployer > Application Web
// (Exécuter en tant que : moi / Accès : Tout le monde).

const SHEET_GID = 0;            // onglet « Feuille 1 »
const COL_STRUCTURE = 'Structure';
const COL_VALIDE = 'Validé';

function norm_(v) {
  return String(v || '').replace(/\s+/g, ' ').trim().replace(/[ .;]+$/, '').toLowerCase();
}

function doPost(e) {
  const out = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
  try {
    const req = JSON.parse(e.postData.contents);   // { row, structure, valide }
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.getActive().getSheets().find(s => s.getSheetId() === SHEET_GID);
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
    let colValide = headers.indexOf(COL_VALIDE) + 1;
    if (!colValide) {                              // crée la colonne si elle n'existe pas
      colValide = lastCol + 1;
      sheet.getRange(1, colValide).setValue(COL_VALIDE);
    }
    const colStruct = headers.indexOf(COL_STRUCTURE) + 1;
    const row = Number(req.row);
    if (!(row >= 2 && row <= sheet.getLastRow())) return out({ ok: false, error: 'ligne invalide' });
    // garde-fou : la ligne doit toujours correspondre à la même structure
    if (norm_(sheet.getRange(row, colStruct).getValue()) !== norm_(req.structure)) {
      return out({ ok: false, error: 'le tableau a changé, rechargez la carte' });
    }
    sheet.getRange(row, colValide).setValue(req.valide ? 'oui' : '');
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}
