import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.PRODUCTION
  ? process.env.TELEGRAM_BOT_API
  : process.env.LOCAL_TELEGRAM_BOT_API;
const upbitToken = process.env.TELEGRAM_UPBIT_BOT_API;
const binanceToken = process.env.TELEGRAM_BINANCE_BOT_API;
const groupKey = process.env.GROUP_KEY;
const chatId = process.env.PRODUCTION ? [groupKey] : [1258091981];
const bot = new TelegramBot(token, { polling: true });
const upbitBot = new TelegramBot(upbitToken, { polling: true });
const binanceBot = new TelegramBot(binanceToken, { polling: true });
export let checkBot = false;
export let coinPercent = {};
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
      body: { coinPer },
    } = req;
    if (checkBot === false) {
      checkBot = true;
      for (let i = 0; i < Object.keys(coinPer).length; i++) {
        if (coinPer[Object.keys(coinPer)[i]] !== "") {
          coinPercent[Object.keys(coinPer)[i]] =
            coinPer[Object.keys(coinPer)[i]];
        }
      }
      console.log(coinPercent);
    } else {
      checkBot = false;
      coinPercent = {};
      sendMessage(`------알림 취소------\n`, true);
    }
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
    checkBot = false;
    coinPercent = {};
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
