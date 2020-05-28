import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.PRODUCTION
  ? process.env.TELEGRAM_BOT_API
  : process.env.LOCAL_TELEGRAM_BOT_API;
export const chatId = [1258091981]; //, 401733277, 302830051];
export const bot = new TelegramBot(token, { polling: true });
export const sendMessage = async (message, started) => {
  if (started) {
    [].forEach.call(chatId, (id) => {
      try {
        bot.sendMessage(id, message);
      } catch (e) {
        console.log("error");
      }
    });
  }
};
export const postMessage = (req, res, next) => {
  try {
    const {
      body: { coinInfo },
    } = req;
    const msg = `${coinInfo.symbol} 업비트:${coinInfo.upbit}₩ 바이낸스:${coinInfo.binance}₩  (${coinInfo.percent}%)\n`;
    sendMessage(msg, true);
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const postCancelMessage = (req, res, next) => {
  try {
    const msg = `------알림 취소------\n`;
    sendMessage(msg, true);
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
