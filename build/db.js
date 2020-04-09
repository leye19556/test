"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_mongoose["default"].connect("mongodb://localhost/coin_at", {
  useNewUrlParser: true,
  useFindAndModify: false
});

var db = _mongoose["default"].connection;
db.on("error", console.error);
db.once("open", function () {
  console.log("Connected to mongodb server");
});