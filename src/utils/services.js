import axios from 'axios';

export const pushMessage = async (headers, data) => {
  try {
    const result = await axios.post(
      `${process.env.LINE_WEBHOOK_URL}/push`, 
      data,
      {
        headers,
      }
    );

    return result;
  } catch (e) {
    logger.error(e.response.data);
  }
}
 
export const replyMessage = async (headers, data) => {
  try {
    await axios.post(
      `${process.env.LINE_WEBHOOK_URL}/reply`, 
      data,
      {
        headers,
      }
    );
  } catch (e) {
    logger.error(e.response.data);
  }
}
