"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDepositNotice = exports.getWithdrawNotice = exports.sendWalletNotice = void 0;

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _botController = require("./botController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var token = process.env.PRODUCTION ? process.env.TELEGRAM_WALLET_BOT_API : process.env.LOCAL_TELEGRAM_WALLET_BOT_API;
var bot = new _nodeTelegramBotApi["default"](token, {
  polling: true
});

var sendWalletNotice = function sendWalletNotice(msg) {
  bot.sendMessage(_botController.chatId, msg);
}; //지갑 출금 알림(업비트,...)


exports.sendWalletNotice = sendWalletNotice;

var getWithdrawNotice = function getWithdrawNotice() {
  sendWalletNotice("출금");
}; //지갑 입금 알림(업비트,...)


exports.getWithdrawNotice = getWithdrawNotice;

var getDepositNotice = function getDepositNotice() {
  sendWalletNotice("입금");
};

exports.getDepositNotice = getDepositNotice;