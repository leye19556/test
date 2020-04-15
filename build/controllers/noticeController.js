"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postUpbitNotice = exports.postBinanceNotice = exports.getBinanceNotice = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _binanceNoticeModel = _interopRequireDefault(require("../models/binanceNoticeModel"));

var _upbitNoticeModel = _interopRequireDefault(require("../models/upbitNoticeModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getBinanceNotice = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var notices, checkNewNotices;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _binanceNoticeModel["default"].find();

          case 3:
            notices = _context.sent;
            checkNewNotices = notices.map(function (item) {
              if (item.updatedAt === (0, _moment["default"])().format("YYYY/MM/DD") && item.checked === false) return {
                "new": true,
                notice: item
              };else return {
                "new": false,
                notice: item
              };
            });
            res.json(checkNewNotices);
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

  return function getBinanceNotice(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.getBinanceNotice = getBinanceNotice;

var postBinanceNotice = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var notices, i, notice, coin;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            notices = req.body.notices;
            i = 0;

          case 3:
            if (!(i < notices.length)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 6;
            return _binanceNoticeModel["default"].findOne({
              title: notices[i].notice.title
            });

          case 6:
            notice = _context2.sent;

            if (notice.checked === false) {
              coin = notice.coin; //매수할 코인

              notice.checked = true;
              notice.save(); //매수 작업 진행

              console.log("Binance ".concat(coin, " \uB9E4\uC218"));
            }

          case 8:
            i++;
            _context2.next = 3;
            break;

          case 11:
            res.end();
            _context2.next = 18;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);
            next(_context2.t0);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function postBinanceNotice(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postBinanceNotice = postBinanceNotice;

var postUpbitNotice = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var notices, i, symbol, notice;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            notices = req.body.notices;
            i = 0;

          case 3:
            if (!(i < notices.length)) {
              _context3.next = 15;
              break;
            }

            symbol = notices[i].notice.title.slice(notices[i].notice.title.lastIndexOf(" ") + 1, notices[i].notice.title.length - 1);
            _context3.next = 7;
            return _upbitNoticeModel["default"].findOne({
              coin: symbol
            });

          case 7:
            notice = _context3.sent;

            if (notice) {
              _context3.next = 12;
              break;
            }

            _context3.next = 11;
            return _upbitNoticeModel["default"].create({
              title: notices[i].notice.title,
              coin: symbol,
              updatedAt: notices[i].notice.updated_at,
              createdAt: notices[i].notice.created_at,
              checked: true
            });

          case 11:
            //오늘 새로운 상장 코인, 코인 매수 작업 진행
            console.log("Upbit ".concat(symbol, " \uB9E4\uC218"));

          case 12:
            i++;
            _context3.next = 3;
            break;

          case 15:
            res.end();
            _context3.next = 22;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](0);
            console.error(_context3.t0);
            next(_context3.t0);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 18]]);
  }));

  return function postUpbitNotice(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.postUpbitNotice = postUpbitNotice;