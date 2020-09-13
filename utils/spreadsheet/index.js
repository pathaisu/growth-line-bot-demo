import google from 'google-spreadsheet';
import {
  credentials,
  sheetId,
} from './config.js';

const doc = new google.GoogleSpreadsheet(sheetId);

export const setSpreadsheetData = async (data) => {
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo(); 

  const sheet = doc.sheetsByIndex[0];

  sheet.setHeaderRow([
    'userId',
    'displayName',
    'pictureUrl',
    'statusMessage',
    'language',
  ]);

  await sheet.addRow({
    ...data,
  });
}

export const getSpreadsheetData = async (data) => {
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo(); 

  const sheet = doc.sheetsByIndex[0];

  const rows = await sheet.getRows();

  const result = rows.map(data => ({
    userId: data.userId,
    displayName: data.displayName,
    pictureUrl: data.pictureUrl,
    statusMessage: data.statusMessage,
    language: data.language,
  }));
  
  return result;
}
