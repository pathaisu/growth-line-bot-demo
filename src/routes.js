import asyncHandler from 'express-async-handler';
import bodyParser from 'body-parser';
import { 
  getSpreadsheetData, 
  setShouldSend,
} from './utils/spreadsheet/index.js';
import { logger } from './logger.js';
import {
  middleware,
  handleCallbackEvent,
  handlePushEvent,
} from './line.js';

const jsonParser = bodyParser.json();

export const setRoutes = (app) => {
  app.get('/followers', asyncHandler(async (_, res) => {
    const payload = await getSpreadsheetData();
    logger.info('GET: get followers');
    
    res.json(payload);
  })); 
  
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
  
  app.post('/push', jsonParser, asyncHandler(async (req, res) => {
    const { text, to } = JSON.parse(JSON.stringify(req.body));
  
    const replyPayload = await handlePushEvent(to, text);
    logger.info(`POST: push message to ${to}`);
  
    res.json(replyPayload);
  }));

  app.post('/targeted', jsonParser, asyncHandler(async (req, res) => {
    const { text } = JSON.parse(JSON.stringify(req.body));

    const followers = await getSpreadsheetData();

    const followersId = followers
      .filter(user => user.shouldSend === 'TRUE')
      .map(user => user.userId);
    
    followersId.forEach(to => {
      handlePushEvent(to, text);
      setShouldSend(to, false);
    });

    logger.info('POST: multicast message to targeted followers');
    
    res.json({ result: 'sent' });
  }));
}
