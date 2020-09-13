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

export const handleCallbackEvent = async (event) => {
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
