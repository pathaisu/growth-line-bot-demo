import line from '@line/bot-sdk';
import express from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import 'dotenv/config.js';

import {
  setSpreadsheetData,
  getSpreadsheetData
} from './utils/spreadsheet/index.js';

const port = process.env.PORT || 3001;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const lineHeader = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
};

const client = new line.Client(config);
const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.post('/push', asyncHandler(async (_, res) => {
   const replyPayload = await client.pushMessage('Uaeef12de300b2ee0834ddd51981fa5ea', {
     type: 'text', text: 'Test push message naja',
   });

   return res.json(replyPayload);
}));

app.get('/followers', asyncHandler(async (_, res) => {
  const payload = await getSpreadsheetData();
  console.log(payload);
  
  res.json(payload);
}));

// event handler
async function handleEvent(event) {
  if (event.type === 'follow') {
    const { data } = await axios.get(`https://api.line.me/v2/bot/profile/${event.source.userId}`, {
      headers: {
        ...lineHeader,
      }
    });

    setSpreadsheetData(data);
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: `Reply From Lucky :) - ${event.message.text}` };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
