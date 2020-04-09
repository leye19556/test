"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localMiddleware = exports.getCoinNames = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _ccxt = _interopRequireDefault(require("ccxt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getCoinNames = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var type,
        binance,
        huobi,
        upbit,
        binance_symbols,
        upbit_symbols,
        huobi_symbols,
        bcoinList,
        ucoinList,
        hcoinList,
        _coinList,
        coinList,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            type = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
            binance = new _ccxt["default"].binance(), huobi = new _ccxt["default"].huobipro(), upbit = new _ccxt["default"].upbit();
            _context.next = 4;
            return Promise.all([binance.loadMarkets(), huobi.loadMarkets(), upbit.loadMarkets()]);

          case 4:
            _context.next = 6;
            return binance.symbols;

          case 6:
            binance_symbols = _context.sent;
            _context.next = 9;
            return upbit.symbols;

          case 9:
            upbit_symbols = _context.sent;
            _context.next = 12;
            return huobi.symbols;

          case 12:
            huobi_symbols = _context.sent;
            bcoinList = binance_symbols.filter(function (v) {
              return v.includes("/BTC");
            });
            ucoinList = upbit_symbols.filter(function (v) {
              return v.includes("/BTC");
            });
            hcoinList = huobi_symbols.filter(function (v) {
              return v.includes("/BTC");
            }); //console.log(bcoinList.length, ucoinList.length, hcoinList.length);

            if (!(type === 1)) {
              _context.next = 19;
              break;
            }

            _coinList = ucoinList.filter(function (v) {
              return bcoinList.includes(v);
            }).filter(function (v) {
              return hcoinList.includes(v);
            }).map(function (v) {
              return v.slice(0, v.indexOf("/"));
            });
            return _context.abrupt("return", _coinList);

          case 19:
            coinList = ucoinList.filter(function (v) {
              return bcoinList.includes(v);
            }).filter(function (v) {
              return hcoinList.includes(v);
            });
            return _context.abrupt("return", coinList);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getCoinNames() {
    return _ref.apply(this, arguments);
  };
}();

exports.getCoinNames = getCoinNames;

var localMiddleware = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.locals.pageTitle = "CoinAT";
            res.locals.moment = _moment["default"];
            _context2.next = 4;
            return getCoinNames(1);

          case 4:
            res.locals.coins = _context2.sent;
            next();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function localMiddleware(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.localMiddleware = localMiddleware;