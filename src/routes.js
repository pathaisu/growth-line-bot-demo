import asyncHandler from 'express-async-handler';
import bodyParser from 'body-parser';
import 'dotenv/config.js';

import { logger } from './utils/logger.js';

import {
  pushMessage, 
  replyMessage,
} from './utils/services.js';

import {
  handlePushEvent,
  handleCallbackEvent,
  getLineHeaders,
  getLineConfig,
} from './line.js';


const jsonParser = bodyParser.json();

export const setRoutes = (app) => {
  app.post('/callback', jsonParser, asyncHandler(async (req) => {
    logger.info('POST: reply message');

    const event = req.body.events[0] || {};
    const config = getLineConfig(req);
    const headers = getLineHeaders(config.CHANNEL_ACCESS_TOKEN);
    const message = await handleCallbackEvent(headers, event, config);
    const data = {
      replyToken: event.replyToken,
      messages: [
        { ...message },
      ],
    };

    await replyMessage(headers, data);
  }));

  app.post('/push', jsonParser, asyncHandler(async (req, res) => {
    try {
      const { text, to } = JSON.parse(JSON.stringify(req.body));
  
      logger.info(`POST: push message to ${to}`);
        
      const config = getLineConfig(req);
      const headers = getLineHeaders(config.CHANNEL_ACCESS_TOKEN);
      const message = await handlePushEvent(headers, to, text);
      const payload = {
        to: to,
        messages: [
          { ...message },
        ],
      };
    
      await pushMessage(headers, payload);
    
      res.json({ status: 'success' });
    } catch(e) {
      logger.error(e);

      res.json({ status: `${e}` })
    }
  }));
}
