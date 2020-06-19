import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.PRODUCTION
  ? process.env.TELEGRAM_BOT_API
  : process.env.LOCAL_TELEGRAM_BOT_API;
const upbitToken = process.env.TELEGRAM_UPBIT_BOT_API;
const binanceToken = process.env.TELEGRAM_BINANCE_BOT_API;
export const chatId = [-1001207277600];
//[1258091981,401733277, 302830051];
const bot = new TelegramBot(token, { polling: true });
const upbitBot = new TelegramBot(upbitToken, { polling: true });
const binanceBot = new TelegramBot(binanceToken, { polling: true });
export const sendMessage = async (message, started, type = "") => {
  if (started) {
    [].forEach.call(chatId, (id) => {
      try {
        if (type === "") bot.sendMessage(id, message);
        else if (type === "upbit") upbitBot.sendMessage(id, message);
        else if (type === "binance") binanceBot.sendMessage(id, message);
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
    console.log(coinInfo.percentBit);
    let msg = `[${coinInfo.symbol}]`;
    if (
      coinInfo.upbit !== undefined &&
      coinInfo.percentUp !== undefined &&
      coinInfo.percentUp !== -100
    ) {
      msg += `업비트:${coinInfo.upbit}₩ 바이낸스:${coinInfo.binance}₩  (${coinInfo.percentUp}%) `;
    }
    if (
      coinInfo.bithumb !== undefined &&
      coinInfo.percentBit !== undefined &&
      coinInfo.percentBit !== -100
    ) {
      msg += `빗썸:${coinInfo.bithumb}₩ 바이낸스:${
        coinInfo.binance
      }₩ (${`${coinInfo.percentBit}%`})`;
    }
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
