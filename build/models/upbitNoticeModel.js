"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var upbitNoticeSchema = new _mongoose["default"].Schema({
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
    "default": null
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

var upbitNoticeModel = _mongoose["default"].model("UpbitNotice", upbitNoticeSchema);

var _default = upbitNoticeModel;
exports["default"] = _default;