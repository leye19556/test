"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _botController = require("../controllers/botController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = _express["default"].Router();

app.post("/", _botController.postMessage);
var _default = app;
exports["default"] = _default;