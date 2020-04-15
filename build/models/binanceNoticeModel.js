"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var binanceNoticeSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: "title is required"
  },
  coin: {
    type: String,
    required: "coin is required"
  },
  link: {
    type: String,
    required: "link is required"
  },
  updatedAt: {
    type: String,
    required: "updatedAt is required"
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  }
});

var binanceNoticeModel = _mongoose["default"].model("BinanceNotice", binanceNoticeSchema);

var _default = binanceNoticeModel;
exports["default"] = _default;