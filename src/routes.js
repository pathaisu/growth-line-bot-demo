import asyncHandler from 'express-async-handler';
import { getSpreadsheetData } from './utils/spreadsheet/index.js';
import {
  middleware,
  handleCallbackEvent,
  handlePushEvent,
} from './line.js';


export const setRoutes = (app) => {
  app.post('/callback', middleware, (req, res) => {
    Promise
      .all(req.body.events.map(handleCallbackEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });
  
  app.post('/push', asyncHandler(async (_, res) => {
    const replyPayload = await handlePushEvent();
  
    res.json(replyPayload);
  }));
  
  app.get('/followers', asyncHandler(async (_, res) => {
    const payload = await getSpreadsheetData();
    
    res.json(payload);
  }));  
}
