"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _coinController = require("../controllers/coinController");

var _noticeController = require("../controllers/noticeController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Router = _express["default"].Router();

Router.get("/", _coinController.getCoin);
Router.post("/", _coinController.postCoin);
Router.post("/check", _coinController.checkCoin);
Router.get("/notice", _noticeController.getBinanceNotice);
Router.post("/notice/binance", _noticeController.postBinanceNotice);
Router.post("/notice/upbit", _noticeController.postUpbitNotice);
var _default = Router;
exports["default"] = _default;