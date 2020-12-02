import axios from 'axios';
import replace from 'lodash/replace.js';
import 'dotenv/config.js';

import { logger } from './utils/logger.js';
import { DEFAULT_CONFIG, CTC_CONFIG } from './utils/config.js'; 


export const handlePushEvent = async (headers, to, text) => {
  let message = {
    type: 'text', 
    text, 
  };

  if (!text.includes('{Nickname}')) return message;

  const { data } = await axios.get(
    `${process.env.LINE_GET_PROFILE_URL}/${to}`, {
      headers,
  });
  
  message.text = replace(text, /{Nickname}/g, data.displayName);
  logger.info(`Original message: ${text}`);
  logger.info(`New message: ${message.text}`);

  return message;
}

export const handleCallbackEvent = async (headers, event, config) => {
  /** ignore non-text-message event */
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const { data } = await axios.get(
    `${process.env.LINE_GET_PROFILE_URL}/${event.source.userId}`, {
      headers,
    });

  let message = {
    type: 'text', 
    text: config.REPLY_MESSAGE, 
  };

  if (event.message.text === config.ONBOARDING_COMMAND) {
    message.text = `${config.DEMO_MESSAGE}\n${config.ONBOARDING_URL}?lineId=${event.source.userId}&pictureUrl=${data.pictureUrl}`;
  }

  return message;
}

export const getLineHeaders = (channelAccessToken) => {
  return ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${channelAccessToken}`,
  });
}

export const getLineConfig = (req) => {
  if (req.headers.host.includes('ctc')) return CTC_CONFIG;

  return DEFAULT_CONFIG;
}
