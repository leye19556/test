"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

_mongoose["default"].connect(process.env.PRODUCTION ? process.env.HEROKU_DB : process.env.LOCAL_DB, {
  useNewUrlParser: true,
  useFindAndModify: false
});

var db = _mongoose["default"].connection;
db.on("error", console.error);
db.once("open", function () {
  console.log("Connected to mongodb server");
});