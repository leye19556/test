"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//import ccxt from "ccxt";
//import "@babel/polyfill";
//import { sendMessage, bot, chatId } from "./controllers/botController";
//import { getCoinList } from "./coinList";
//import axios from "axios";

/*let currentRate = 0,
  currentSymbol = "All",
  alarmStarted = false;
const getCurreny = () => {
  const result = axios.get(
    `https://ko.valutafx.com/LookupRate.aspx?to=KRW&from=USD&amount=1&offset=-540&fi=`
  );
  return result;
};
const getUpbitBtcKrw = () => {
  const result = axios.get(`https://api.upbit.com/v1/ticker?markets=KRW-BTC`);
  return result;
};
const getBinanceBtcUsd = () => {
  const result = axios.get(
    `https://www.binance.us/api/v1/aggTrades?limit=1&symbol=BTCUSD`
  );
  return result;
};
/*const getHuobiExchangeRate = () => {
  const result = axios.get(
    `https://www.huobi.com/-/x/general/exchange_rate/list?r=2hdwx1k4n72`
  );
  return result;
};
const filterHuobiData = data => {
  const filteredData = data.filter(
    v => v.name === "cny_krw" || v.name === "btc_cny"
  );
  return { btccny: filteredData[1].rate, cnykrw: filteredData[0].rate };
};*/
//export const watchingCoin = (coin, percent) => {
//console.log(coin, percent);
//};
var requestCoinInfo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var base,
        symbol,
        upbit,
        binance,
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
            upbit = new ccxt.upbit(), binance = new ccxt.binance(); //huobi = new ccxt.huobipro();

            coinList = getCoinList();
            _context.t0 = Promise;
            _context.next = 8;
            return upbit.fetchTickers(coinList["krw"]);

          case 8:
            _context.t1 = _context.sent;
            _context.next = 11;
            return binance.fetchTickers(coinList["btc"]);

          case 11:
            _context.t2 = _context.sent;
            _context.t3 = [_context.t1, _context.t2];
            _context.next = 15;
            return _context.t0.all.call(_context.t0, _context.t3).then(function (data) {
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
              }); //const huobi_data = Object.entries(huobidata)
              //.filter(v => v[0].includes("/BTC"))
              //.sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
              //console.log(huobi_data.length, binance_data.length, upbit_data.length);

              return {
                upbit: {
                  data: upbit_data
                },
                binance: {
                  data: binance_data
                } //huobi: { data: huobi_data }

              };
            })["catch"](function (e) {
              console.log(e);
            });

          case 15:
            info = _context.sent;

            if (currentSymbol !== symbol) {
              currentRate = 0;
              currentSymbol = symbol;
            }

            return _context.abrupt("return", info);

          case 20:
            _context.prev = 20;
            _context.t4 = _context["catch"](2);
            console.error(_context.t4);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 20]]);
  }));

  return function requestCoinInfo() {
    return _ref.apply(this, arguments);
  };
}();

var socket = function socket(io) {
  io.on("connection", function (socket) {
    //socket 연결
    console.log("Socket Connected");
    socket.on("updateInfo", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(payload) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                io.emit("updateInfo", data);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    socket.on("settingAlarm", function (payload) {
      io.emit("settingAlarm", payload);
    });
    socket.on("disconnect", function () {
      console.log("disconnected");
    });
  });
};

var _default = socket;
exports["default"] = _default;