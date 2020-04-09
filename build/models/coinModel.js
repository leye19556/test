"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var coinSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: "name is required"
  },
  checked: {
    type: Boolean,
    "default": false
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  }
});

var coinModel = _mongoose["default"].model("Coin", coinSchema);

var _default = coinModel;
exports["default"] = _default;