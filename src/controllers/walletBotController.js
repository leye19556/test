import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { chatId } from "./botController";
dotenv.config();
const token = process.env.TELEGRAM_WALLET_BOT_API;
const bot = new TelegramBot(token, { polling: true });
export const sendWalletNotice = msg => {
  bot.sendMessage(chatId, msg);
};

//지갑 출금 알림(업비트,...)
export const getWithdrawNotice = () => {
  sendWalletNotice("출금");
};
//지갑 입금 알림(업비트,...)
export const getDepositNotice = () => {
  sendWalletNotice("입금");
};
