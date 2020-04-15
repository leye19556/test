"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBinanceNotice = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _binanceNoticeModel = _interopRequireDefault(require("../models/binanceNoticeModel"));

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