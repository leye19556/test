"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCoin = exports.postCoin = exports.getCoin = void 0;

var _coinModel = _interopRequireDefault(require("../models/coinModel"));

var _nodeBinanceApi = _interopRequireDefault(require("node-binance-api"));

var _axios = _interopRequireDefault(require("axios"));

var _walletBotController = require("./walletBotController");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getUpbitTickers = function getUpbitTickers(coins) {
  var symbols = "";

  for (var i = 0; i < coins.length; i++) {
    if (i < coins.length - 1) {
      symbols += "BTC-".concat(coins[i].toUpperCase(), ",");
    } else {
      symbols += "BTC-".concat(coins[i].toUpperCase());
    }
  }

  return _axios["default"].get("https://api.upbit.com/v1/ticker?markets=".concat(symbols));
};

var binanceBid = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(coin) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _walletBotController.sendWalletNotice)("".concat(coin, " \uB9E4\uC218"));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function binanceBid(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getCoin = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var id, coin;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            id = req.query.id;
            _context2.next = 4;
            return _coinModel["default"].findById(id);

          case 4:
            coin = _context2.sent;
            res.json(coin);
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);
            next(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function getCoin(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getCoin = getCoin;

var postCoin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var coins, newCoins;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            try {
              coins = req.body.coins;
              newCoins = [];
              [].forEach.call(coins, /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(name) {
                  var coin;
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          if (!(name !== null && name !== undefined)) {
                            _context3.next = 8;
                            break;
                          }

                          _context3.next = 3;
                          return _coinModel["default"].findOne({
                            name: name
                          });

                        case 3:
                          coin = _context3.sent;

                          if (coin) {
                            _context3.next = 8;
                            break;
                          }

                          _context3.next = 7;
                          return _coinModel["default"].create({
                            name: name
                          });

                        case 7:
                          newCoins.push(name);

                        case 8:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x8) {
                  return _ref4.apply(this, arguments);
                };
              }());
              res.json(newCoins);
            } catch (e) {
              next(e);
            }

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function postCoin(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

exports.postCoin = postCoin;

var checkCoin = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var _req$body, coins, x, binance, _yield$getUpbitTicker, data, upbit_tickers, tickers;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _req$body = req.body, coins = _req$body.coins, x = _req$body.x;
            binance = new _nodeBinanceApi["default"]().options({
              test: true
            });
            _context6.next = 5;
            return getUpbitTickers(coins);

          case 5:
            _yield$getUpbitTicker = _context6.sent;
            data = _yield$getUpbitTicker.data;
            upbit_tickers = {};
            [].forEach.call(data, function (v) {
              var name = v.market.split("-");
              upbit_tickers["".concat(name[1]).concat(name[0])] = v;
            });
            _context6.next = 11;
            return binance.prices();

          case 11:
            tickers = _context6.sent;
            [].forEach.call(coins, /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(coin) {
                var c, ticker1, ticker2, diff;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return _coinModel["default"].findOne({
                          name: coin.toUpperCase()
                        });

                      case 2:
                        c = _context5.sent;

                        if (c && !c.checked) {
                          ticker1 = tickers["".concat(coin.toUpperCase(), "BTC")];
                          ticker2 = upbit_tickers["".concat(coin.toUpperCase(), "BTC")];
                          diff = ((ticker1 - ticker2.trade_price) / ticker1 * 100).toFixed(2);
                          console.log(ticker1, ticker2.trade_price, diff); //% 차이 계산

                          if (diff > 0 && Math.abs(diff) < x) {
                            console.log("\uBC14\uC774\uB0B8\uC2A4: ".concat(coin, " \uB9E4\uC218"));
                            /*await coinModel.findOneAndUpdate(
                              { name: coin.toUpperCase() },
                              {
                                checked: true
                              }
                            );*/

                            binanceBid(coin.toUpperCase()); //국내 상장 코인 해외 거래소에서 차이값 체크, x%이내시 시장가 매수 하도록 설정
                            //x% 이상일 경우 계속 주시
                            //나중에 수정 가능,
                          }
                        }

                      case 4:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x12) {
                return _ref6.apply(this, arguments);
              };
            }());
            res.end();
            _context6.next = 20;
            break;

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](0);
            console.error(_context6.t0);
            next(_context6.t0);

          case 20:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 16]]);
  }));

  return function checkCoin(_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

exports.checkCoin = checkCoin;