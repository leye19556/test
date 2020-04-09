"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ccxt = _interopRequireDefault(require("ccxt"));

var _botController = require("./controllers/botController");

var _coinList = require("./coinList");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var currentRate = 0,
    currentSymbol = "All",
    alarmStarted = false;

var getCurreny = function getCurreny() {
  var result = _axios["default"].get("https://ko.valutafx.com/LookupRate.aspx?to=KRW&from=USD&amount=1&offset=-540&fi=");

  return result;
};

var getUpbitBtcKrw = function getUpbitBtcKrw() {
  var result = _axios["default"].get("https://api.upbit.com/v1/ticker?markets=KRW-BTC");

  return result;
};

var getBinanceBtcUsd = function getBinanceBtcUsd() {
  var result = _axios["default"].get("https://www.binance.us/api/v1/aggTrades?limit=1&symbol=BTCUSD");

  return result;
};

var getHuobiExchangeRate = function getHuobiExchangeRate() {
  var result = _axios["default"].get("https://www.huobi.com/-/x/general/exchange_rate/list?r=2hdwx1k4n72");

  return result;
};

var filterHuobiData = function filterHuobiData(data) {
  var filteredData = data.filter(function (v) {
    return v.name === "cny_krw" || v.name === "btc_cny";
  });
  return {
    btccny: filteredData[1].rate,
    cnykrw: filteredData[0].rate
  };
}; //export const watchingCoin = (coin, percent) => {
//console.log(coin, percent);
//};


var requestCoinInfo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var base,
        symbol,
        upbit,
        binance,
        huobi,
        coinList,
        info,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            base = _args.length > 0 && _args[0] !== undefined ? _args[0] : "";
            symbol = _args.length > 1 && _args[1] !== undefined ? _args[1] : "All";
            _context.prev = 2;
            upbit = new _ccxt["default"].upbit(), binance = new _ccxt["default"].binance(), huobi = new _ccxt["default"].huobipro();
            coinList = (0, _coinList.getCoinList)();
            _context.t0 = Promise;
            _context.next = 8;
            return upbit.fetchTickers(coinList["krw"]);

          case 8:
            _context.t1 = _context.sent;
            _context.next = 11;
            return binance.fetchTickers(coinList["btc"]);

          case 11:
            _context.t2 = _context.sent;
            _context.next = 14;
            return huobi.fetchTickers(coinList["btc"]);

          case 14:
            _context.t3 = _context.sent;
            _context.t4 = [_context.t1, _context.t2, _context.t3];
            _context.next = 18;
            return _context.t0.all.call(_context.t0, _context.t4).then(function (data) {
              var _data = _slicedToArray(data, 3),
                  upbitdata = _data[0],
                  binancedata = _data[1],
                  huobidata = _data[2];

              var upbit_data = Object.entries(upbitdata).filter(function (v) {
                return v[0].includes("/KRW");
              }).sort(function (x, y) {
                return x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1;
              });
              var binance_data = Object.entries(binancedata).filter(function (v) {
                return v[0].includes("/BTC");
              }).sort(function (x, y) {
                return x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1;
              });
              var huobi_data = Object.entries(huobidata).filter(function (v) {
                return v[0].includes("/BTC");
              }).sort(function (x, y) {
                return x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1;
              }); //console.log(huobi_data.length, binance_data.length, upbit_data.length);

              return {
                upbit: {
                  data: upbit_data
                },
                binance: {
                  data: binance_data
                },
                huobi: {
                  data: huobi_data
                }
              };
            })["catch"](function (e) {
              console.log(e);
            });

          case 18:
            info = _context.sent;

            if (currentSymbol !== symbol) {
              currentRate = 0;
              currentSymbol = symbol;
            }

            return _context.abrupt("return", info);

          case 23:
            _context.prev = 23;
            _context.t5 = _context["catch"](2);
            console.error(_context.t5);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 23]]);
  }));

  return function requestCoinInfo() {
    return _ref.apply(this, arguments);
  };
}();

var getCoinInfo = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(base, symbol, percent) {
    var _btc_huobi$data;

    var result, usd_krw, btc_usd, btc_krw, btc_huobi;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return requestCoinInfo(base, symbol);

          case 2:
            result = _context2.sent;
            _context2.next = 5;
            return getCurreny();

          case 5:
            usd_krw = _context2.sent;
            _context2.next = 8;
            return getBinanceBtcUsd();

          case 8:
            btc_usd = _context2.sent;
            _context2.next = 11;
            return getUpbitBtcKrw();

          case 11:
            btc_krw = _context2.sent;
            _context2.next = 14;
            return getHuobiExchangeRate();

          case 14:
            btc_huobi = _context2.sent;
            //console.log(btc_huobi.data.data);
            if (currentSymbol !== "ALL" && alarmStarted) checkDataAndSend(result, usd_krw.data.Rate.split(",").join(""), btc_usd.data[0].p, btc_krw.data[0].trade_price, symbol, percent);
            return _context2.abrupt("return", {
              upbit: {
                upbit_data: result.upbit.data,
                binance_data: result.binance.data,
                huobi_data: result.huobi.data,
                btc_krw: btc_krw.data[0].trade_price,
                usd_krw: usd_krw.data.Rate.split(",").join(""),
                btc_usd: btc_usd.data[0].p,
                huobi_rate: filterHuobiData(btc_huobi === null || btc_huobi === void 0 ? void 0 : (_btc_huobi$data = btc_huobi.data) === null || _btc_huobi$data === void 0 ? void 0 : _btc_huobi$data.data)
              }
            });

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getCoinInfo(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var rateCalculator = function rateCalculator(upbit, binance, btc_krw) {
  //const binanceKrw = (btc_usd * usd_krw).toFixed(0); //Binance BTC/KRW
  var rate = (upbit[1].last - binance[1].last * btc_krw) / upbit[1].last;
  return rate * 100;
};

var checkDataAndSend = function checkDataAndSend(data, usd_krw, btc_usd, btc_krw, symbol, percent) {
  var upbit = data.upbit,
      binance = data.binance;
  var coinName = "".concat(symbol).toUpperCase();
  var upbitCoinInfo = upbit.data.filter(function (v) {
    return v[0] === "".concat(coinName, "/KRW");
  })[0];
  var binanceCoinInfo = binance.data.filter(function (v) {
    return v[0] === "".concat(coinName, "/BTC");
  })[0];
  var binanceKrw = btc_usd * usd_krw;
  var upbit_binance = rateCalculator(upbitCoinInfo, binanceCoinInfo, btc_krw).toFixed(2);

  if (Math.abs(upbit_binance) >= percent && currentRate !== Math.abs(upbit_binance)) {
    console.log("".concat(symbol, " binance\uC640 upbit \uCC28\uC774:").concat(Math.abs(upbit_binance), "%"));
    currentRate = Math.abs(upbit_binance);
    (0, _botController.sendMessage)("".concat(symbol, "\n\uC5C5\uBE44\uD2B8:").concat(upbitCoinInfo[1].last, "\u20A9\n\uBC14\uC774\uB0B8\uC2A4:").concat((binanceCoinInfo[1].last * btc_krw).toFixed(2), "\u20A9  (").concat(upbit_binance * -1, "%)"), true);
  }
};

var settingAlarmBot = function settingAlarmBot(_ref3) {
  var started = _ref3.started,
      coin = _ref3.coin,
      percent = _ref3.percent;
  var resp = "";
  if (started) resp = "[\uCF54\uC778\uC54C\uB9BC \uC124\uC815 \uC644\uB8CC]\n\uCF54\uC778: ".concat(coin.toUpperCase(), " \uAC00\uACA9\uCC28\uC774: ").concat(percent, "% \uC774\uC0C1 \uC2DC \uC54C\uB9BC");else resp = "[\uCF54\uC778\uC54C\uB9BC \uCDE8\uC18C \uC644\uB8CC]";

  _botController.bot.sendMessage(_botController.chatId, resp);

  alarmStarted = started;
};

var socket = function socket(io) {
  io.on("connection", function (socket) {
    //socket 연결
    console.log("Socket Connected");
    socket.on("updateInfo", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(payload) {
        var data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return getCoinInfo(payload.base, payload.symbol, payload.percent);

              case 2:
                data = _context3.sent;
                io.emit("updateInfo", data);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }());
    socket.on("settingAlarm", function (payload) {
      io.emit("settingAlarm", payload);
      settingAlarmBot(payload);
    });
    socket.on("disconnect", function () {
      console.log("disconnected");
    });
  });
};

var _default = socket;
exports["default"] = _default;