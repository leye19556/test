"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

require("./db");

var _globalRoute = _interopRequireDefault(require("./routes/globalRoute"));

var _coinRoute = _interopRequireDefault(require("./routes/coinRoute"));

var _coinsRoute = _interopRequireDefault(require("./routes/coinsRoute"));

var _botRoute = _interopRequireDefault(require("./routes/botRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import socketIO from "socket.io";
//import socket from "./socket";
//import { localMiddleware } from "./middlewares";
_dotenv["default"].config();

var app = (0, _express["default"])();
app.set("view engine", "pug");
app.set("views", _path["default"].join(__dirname, "views"));
app.use((0, _cors["default"])());
app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("dev"));
app.use("/static", _express["default"]["static"](_path["default"].join(__dirname, "static")));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
})); //app.use(localMiddleware);

app.use("/", _globalRoute["default"]);
app.use("/coin", _coinRoute["default"]);
app.use("/coins", _coinsRoute["default"]);
app.use("/bot", _botRoute["default"]);
app.listen(process.env.PORT || 3000, function () {
  console.log("\u2705 express is running on port:".concat(process.env.PORT || 3000));
}); //const io = socketIO(server);
//socket(io);