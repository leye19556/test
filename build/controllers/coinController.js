"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCoin = exports.postCoin = exports.getCoin = void 0;

var _coinModel = _interopRequireDefault(require("../models/coinModel"));

var _axios = _interopRequireDefault(require("axios"));

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

var getCoin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var id, coin;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            id = req.query.id;
            _context.next = 4;
            return _coinModel["default"].findById(id);

          case 4:
            coin = _context.sent;
            res.json(coin);
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            next(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function getCoin(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getCoin = getCoin;

var postCoin = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var coins, newCoins;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            try {
              coins = req.body.coins;
              newCoins = [];
              [].forEach.call(coins, /*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
                  var coin;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!(name !== null && name !== undefined)) {
                            _context2.next = 8;
                            break;
                          }

                          _context2.next = 3;
                          return _coinModel["default"].findOne({
                            name: name
                          });

                        case 3:
                          coin = _context2.sent;

                          if (coin) {
                            _context2.next = 8;
                            break;
                          }

                          _context2.next = 7;
                          return _coinModel["default"].create({
                            name: name
                          });

                        case 7:
                          newCoins.push(name);

                        case 8:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x7) {
                  return _ref3.apply(this, arguments);
                };
              }());
              res.json(newCoins);
            } catch (e) {
              next(e);
            }

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function postCoin(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postCoin = postCoin;

var checkCoin = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var coins;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            try {
              coins = req.body.coins;
              res.end();
            } catch (e) {
              console.error(e);
              next(e);
            }

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function checkCoin(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

exports.checkCoin = checkCoin;