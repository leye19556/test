import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
//import { watchingCoin } from "../socket";
dotenv.config();
const token = process.env.TELEGRAM_BOT_API;
export const chatId = 1258091981;
export const bot = new TelegramBot(token, { polling: true });
export const sendMessage = (message, started) => {
  if (started) bot.sendMessage(chatId, message);
};
const init = () => {
  bot.onText(/\/알림설정 (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const info = match[1].split(" "),
      coin = info[0],
      percent = info[1];
    const resp = `[코인알림 설정 완료]\n코인:${coin} 가격차이:${percent}% 이상 시 알림`;
    bot.sendMessage(chatId, resp);
    //watchingCoin(coin, percent);
  });
  bot.onText(/\/자동 (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const info = match[1].split(" ");
    const exchange = info[0],
      coin = info[1],
      volume = info[2];
    const resp = `[자동거래 ${exchange}]\n 코인:${coin}\n 수량:${volume}\n 거래주기:무제한\n 반복횟수:무제한\n\n 봇을 구동하기 위해서는 /테스트 혹은 /시작 을 입력하세요    `;
    bot.sendMessage(chatId, resp);
  });
  bot.onText(/\/거래주기 ([0-9]+)/, (msg, match) => {
    const resq = match[1];
    console.log(resq);
  });
  bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    started = true;
    bot.sendMessage(chatId, "봇 알림 시작");
  });
  bot.onText(/\/알림 (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const info = match[1].split("");
    bot.sendMessage(chatId);
  });
  bot.onText(/\/명령어/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `/start  봇 알림 시작\n/end    봇 알림 종료\n/menu   명령어 리스트\n/알림 [코인] [퍼센트]`
    );
  });
  bot.onText(/\/end/, msg => {
    const chatId = msg.chat.id;
    started = false;
    bot.sendMessage(chatId, "알림을 종료합니다.");
  });
};
init();
