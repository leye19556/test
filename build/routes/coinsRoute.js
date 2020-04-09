"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _coinsController = require("../controllers/coinsController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Router = _express["default"].Router();

Router.get("/", _coinsController.getCoins);
var _default = Router;
exports["default"] = _default;