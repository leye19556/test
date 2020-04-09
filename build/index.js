"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _helmet = _interopRequireDefault(require("helmet"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _socket = _interopRequireDefault(require("socket.io"));

var _socket2 = _interopRequireDefault(require("./socket"));

require("./db");

var _middlewares = require("./middlewares");

var _globalRoute = _interopRequireDefault(require("./routes/globalRoute"));

var _coinRoute = _interopRequireDefault(require("./routes/coinRoute"));

var _coinsRoute = _interopRequireDefault(require("./routes/coinsRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
app.set("view engine", "pug");
app.set("views", _path["default"].join(__dirname, "views"));
app.use((0, _helmet["default"])());
app.use((0, _morgan["default"])("dev"));
app.use("/static", _express["default"]["static"](_path["default"].join(__dirname, "static")));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_middlewares.localMiddleware);
app.use("/", _globalRoute["default"]);
app.use("/coin", _coinRoute["default"]);
app.use("/coins", _coinsRoute["default"]);
var PORT = process.env.PORT;
var server = app.listen(8989, function () {
  console.log("\u2705 express is running on port:".concat(PORT));
});
var io = (0, _socket["default"])(server);
(0, _socket2["default"])(io);