"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessage = exports.bot = exports.chatId = void 0;

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import { watchingCoin } from "../socket";
_dotenv["default"].config();

var token = process.env.TELEGRAM_BOT_API;
var chatId = 1258091981;
exports.chatId = chatId;
var bot = new _nodeTelegramBotApi["default"](token, {
  polling: true
});
exports.bot = bot;

var sendMessage = function sendMessage(message, started) {
  if (started) bot.sendMessage(chatId, message);
};

exports.sendMessage = sendMessage;

var init = function init() {
  bot.onText(/\/알림설정 (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var info = match[1].split(" "),
        coin = info[0],
        percent = info[1];
    var resp = "[\uCF54\uC778\uC54C\uB9BC \uC124\uC815 \uC644\uB8CC]\n\uCF54\uC778:".concat(coin, " \uAC00\uACA9\uCC28\uC774:").concat(percent, "% \uC774\uC0C1 \uC2DC \uC54C\uB9BC");
    bot.sendMessage(chatId, resp); //watchingCoin(coin, percent);
  });
  bot.onText(/\/자동 (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var info = match[1].split(" ");
    var exchange = info[0],
        coin = info[1],
        volume = info[2];
    var resp = "[\uC790\uB3D9\uAC70\uB798 ".concat(exchange, "]\n \uCF54\uC778:").concat(coin, "\n \uC218\uB7C9:").concat(volume, "\n \uAC70\uB798\uC8FC\uAE30:\uBB34\uC81C\uD55C\n \uBC18\uBCF5\uD69F\uC218:\uBB34\uC81C\uD55C\n\n \uBD07\uC744 \uAD6C\uB3D9\uD558\uAE30 \uC704\uD574\uC11C\uB294 /\uD14C\uC2A4\uD2B8 \uD639\uC740 /\uC2DC\uC791 \uC744 \uC785\uB825\uD558\uC138\uC694    ");
    bot.sendMessage(chatId, resp);
  });
  bot.onText(/\/거래주기 ([0-9]+)/, function (msg, match) {
    var resq = match[1];
    console.log(resq);
  });
  bot.onText(/\/start/, function (msg, match) {
    var chatId = msg.chat.id;
    started = true;
    bot.sendMessage(chatId, "봇 알림 시작");
  });
  bot.onText(/\/알림 (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var info = match[1].split("");
    bot.sendMessage(chatId);
  });
  bot.onText(/\/명령어/, function (msg) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "/start  \uBD07 \uC54C\uB9BC \uC2DC\uC791\n/end    \uBD07 \uC54C\uB9BC \uC885\uB8CC\n/menu   \uBA85\uB839\uC5B4 \uB9AC\uC2A4\uD2B8\n/\uC54C\uB9BC [\uCF54\uC778] [\uD37C\uC13C\uD2B8]");
  });
  bot.onText(/\/end/, function (msg) {
    var chatId = msg.chat.id;
    started = false;
    bot.sendMessage(chatId, "알림을 종료합니다.");
  });
};

init();