import line from '@line/bot-sdk';
import axios from 'axios';
import 'dotenv/config.js';

import { setSpreadsheetData } from './utils/spreadsheet/index.js';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const lineHeader = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
};

export const client = new line.Client(config);
export const middleware = line.middleware(config);

const handleNewFollower = async () => {
  const { data } = await axios.get(
    `${LINE_GET_PROFILE_URL}/${event.source.userId}`, {
      headers: {
        ...lineHeader,
      }
    });

  setSpreadsheetData(data);
}

/** Support only type text */
export const handleCallbackEvent = async (event) => {
  if (event.type === 'follow') {
    handleNewFollower();
  }

  /** ignore non-text-message event */
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const echo = {
    type: 'text', 
    text: `Reply From Lucky :) - ${event.message.text}` 
  };

  return client.replyMessage(event.replyToken, echo);
}

/** Support only type text */
export const handlePushEvent = async (to, text) => {
  const replyPayload = await client.pushMessage(to, {
    type: 'text',
    text,
  });

  return replyPayload;
}