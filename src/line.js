import line from '@line/bot-sdk';
import axios from 'axios';
import 'dotenv/config.js';

import { setNewFollower } from './utils/spreadsheet/index.js';

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

/** To add new follower */
const handleNewFollower = async (event) => {
  const { data } = await axios.get(
    `${process.env.LINE_GET_PROFILE_URL}/${event.source.userId}`, {
      headers: {
        ...lineHeader,
      }
    });

    setNewFollower(data);
}

/** Support only type text */
export const handleCallbackEvent = async (event) => {
  if (event.type === 'follow') {
    handleNewFollower(event);
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
  const { data } = await axios.get(
    `${process.env.LINE_GET_PROFILE_URL}/${to}`, {
      headers: {
        ...lineHeader,
      }
    });

  const newText = text.replace('{Nickname}', data.displayName);

  const replyPayload = await client.pushMessage(to, {
    type: 'text',
    text: newText,
  });

  return replyPayload;
}
