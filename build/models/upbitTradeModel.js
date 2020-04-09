"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var upbitTradeSchema = new _mongoose["default"].Schema({
  coin: {
    type: String,
    required: "coin is required"
  },
  amount: {
    type: Number,
    "default": 0
  },
  tradedone: {
    type: Boolean,
    "default": false
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  }
});

var upbitTradeModel = _mongoose["default"].model("Upbit", upbitTradeSchema);

var _default = upbitTradeModel;
exports["default"] = _default;