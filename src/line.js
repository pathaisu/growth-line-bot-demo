import line from '@line/bot-sdk';
import axios from 'axios';
import 'dotenv/config.js';

import { setNewFollower } from './utils/spreadsheet/index.js';
import {
  ONBOARDING_COMMAND,
  ONBOARDING_URL,
} from './utils/config.js';

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

  const replyMsg = 'ขอต้อนรับสู่ GROWTHai'
  const demoMsg = '🙏ขอต้อนรับสู่ GROWTHai demo journey ที่จะพาคุณไปทดลองสัมผัสประสบการ์ณตรงจากระบบการตลาดอัตโนมัติผ่านช่องทางแสนสะดวก LINE email และ SMS\n\n✍️เพียงกรอกข้อมูลนี้ให้ครบแล้วเราจะเริ่ม demo journey ทันทีค่ะ';

  let echo = {
    type: 'text', 
    text: replyMsg, 
  };

  if (event.message.text === ONBOARDING_COMMAND) {
    echo.text = `${demoMsg}\n${ONBOARDING_URL}?lineId=${event.source.userId}`;
  }

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

  let replaceText = text;

  if (text === 'สวัสดีค่ะ คุณ {Nickname} ยินดีต้อนรับสู่ Demo ค่ะ') {
    replaceText = 'ขอบคุณนะคะ คุณ {Nickname}  ที่สนใจชม GROWTHai demo journey ที่ขณะนี้ได้เริ่มต้นขึ้นแล้ว คุณจะได้รับข้อความแบบอัตโนมัติจากหลากหลายช่องทาง ที่ตอบสนองต่อความสนใจที่แตกต่างกันไป ลองกลับเข้ามาที่เวบเราอีกครั้งสิคะ www.growthai.co';
  }

  const newText = replaceText.replace('{Nickname}', data.displayName);

  const replyPayload = await client.pushMessage(to, {
    type: 'text',
    text: newText,
  });

  return replyPayload;
}
