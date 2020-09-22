import google from 'google-spreadsheet';
import {
  credentials,
  sheetId,
} from './config.js';

const doc = new google.GoogleSpreadsheet(sheetId);

/**
 * Get sheet from credential
 */
const getSheet = async () => {
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo(); 
  const sheet = doc.sheetsByIndex[0];

  return sheet;
}

/**
 * Extract essential data from sheet
 * @sheet [object] : google-sheet data
 */
const extractInfoFromSheet = async (sheet) => {
  const rows = await sheet.getRows();

  const result = rows.map(data => ({
    userId: data.userId,
    displayName: data.displayName,
    pictureUrl: data.pictureUrl,
    statusMessage: data.statusMessage,
    language: data.language,
    shouldSend: data.shouldSend,
  }));

  return result;
}

/**
 * Get sheet from credential.
 * @sheet [object] : google-sheet data
 * @userId [string] : line follower id ie. Uaeef12de300b2ee0834ddd51981fa5ea
 */
const getExistingId = async (sheet, userId) => {
  const followers = await extractInfoFromSheet(sheet);
  const id = followers
    .map(follower => follower.userId)
    .indexOf(userId);

  return id;
}

/**
 * Set new follower, when no data on spreadsheet
 * Update shouldSend status when data available on spreadsheet
 * @data [object] : data from line after user follows
 */
export const setNewFollower = async (data) => {
  const sheet = await getSheet();
  const id = await getExistingId(sheet, data.userId);
  const shouldSend = true;

  if (id < 0) {
    sheet.setHeaderRow([
      'userId',
      'displayName',
      'pictureUrl',
      'statusMessage',
      'language',
      'shouldSend'
    ]);
  
    await sheet.addRow({
      ...data,
      shouldSend
    });
  } else {
    const rows = await sheet.getRows();

    rows[id].shouldSend = shouldSend;
    await rows[id].save();
  }
}

/**
 * Update shouldSend data
 * @userId [string] : line follower id
 * @shouldSend [string]: shouldSend status
 */
export const setShouldSend = async (userId, shouldSend = false) => {
  const sheet = await getSheet();
  const id = await getExistingId(sheet, userId);
  const rows = await sheet.getRows();

  rows[id].shouldSend = shouldSend;
  await rows[id].save();
}

/**
 * Get formated sheet data
 */
export const getSpreadsheetData = async () => {
  const sheet = await getSheet();
  const result = await extractInfoFromSheet(sheet);
  
  return result;
}
