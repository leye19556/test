import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.PRODUCTION
  ? process.env.TELEGRAM_BOT_API
  : process.env.LOCAL_TELEGRAM_BOT_API;
export const chatId = [1258091981]; //, 401733277];
export const bot = new TelegramBot(token, { polling: true });
const sendMessage = (message, started) => {
  if (started) {
    [].forEach.call(chatId, (id) => {
      bot.sendMessage(id, message);
    });
  }
};
export const postMessage = (req, res, next) => {
  try {
    const {
      body: { coinInfo, percent, binance },
    } = req;
    const msg = `${coinInfo.symbol}\n업비트:${
      coinInfo.last
    }₩\n바이낸스:${binance.toFixed(2)}₩  (${percent}%)`;
    sendMessage(msg, true);
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const init = () => {
  /*bot.onText(/\/알림설정 (.+)/, (msg, match) => {
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
    console.log(chatId);
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
  });*/
};
//init();
