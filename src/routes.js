import asyncHandler from 'express-async-handler';
import { getSpreadsheetData } from './utils/spreadsheet/index.js';
import { logger } from './logger.js';
import {
  middleware,
  handleCallbackEvent,
  handlePushEvent,
} from './line.js';

export const setRoutes = (app) => {
  app.post('/callback', middleware, (req, res) => {
    logger.info('POST: reply message');

    Promise
      .all(req.body.events.map(handleCallbackEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        logger.error(err);
        res.status(500).end();
      });
  });
  
  app.post('/push', asyncHandler(async (_, res) => {
    const to = 'Uaeef12de300b2ee0834ddd51981fa5ea';
    const text = 'Say Hi from Lucky';
  
    const replyPayload = await handlePushEvent(to, text);
    logger.info('POST: push message');
  
    res.json(replyPayload);
  }));
  
  app.get('/followers', asyncHandler(async (_, res) => {
    const payload = await getSpreadsheetData();
    logger.info('GET: get followers');
    
    res.json(payload);
  }));  
}
