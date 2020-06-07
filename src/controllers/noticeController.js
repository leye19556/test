import moment from "moment";
import binanceNoticeModel from "../models/binanceNoticeModel";
import upbitNoticeModel from "../models/upbitNoticeModel";
import "@babel/polyfill";
import { sendMessage } from "./botController";
import {
  getUpbitBalance,
  checkLatestPrice,
  upbitTrade,
} from "./TradeController";
export const getUpbitNotice = async (req, res, next) => {
  try {
    const notices = await upbitNoticeModel.find().sort({ updatedAt: -1 });
    res.json(notices);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const getBinanceNotice = async (req, res, next) => {
  try {
    const notices = await binanceNoticeModel.find().sort({ updatedAt: -1 });
    const newNotice = [];
    const checkNewNotices = notices.map((item) => {
      if (
        item.updatedAt === moment().format("YYYY/MM/DD") &&
        item.checked === false
      ) {
        item.checked = true;
        item.save();
        newNotice.push({ notice: item });
        return { new: true, notice: item };
      } else {
        return { new: false, notice: item };
      }
    });
    if (newNotice.length > 0) {
      for (let i = 0; i < newNotice.length; i++) {
        console.log(`${newNotice[i].coin} 매수 진행`);
        const symbol = newNotice[i].coin;
        const { ask_price, ask_size } = orderbook_units[0];
        limitPrice = parseFloat(
          (parseFloat(ask_price) * 0.02 + parseFloat(ask_price)).toFixed(8)
        );
        while (true) {
          //바이낸스 상장 업비트에서 매수 시도
          const balance = await getUpbitBalance(),
            {
              data: { orderbook_units },
            } = checkLatestPrice(symbol, "upbit");
          const { ask_price: price, ask_size: qty } = orderbook_units[0];
          const upbitCoinInfo = upbitBalance.data.filter(
            (coin) => coin.currency === "KRW"
          )[0];
          if (
            price <= limitPrice &&
            parseFloat(upbitCoinInfo.balance, 10) >=
              parseFloat(price, 10) * parseFloat(qty, 10)
          ) {
            //지갑 잔고, 매수 금액 비교 진행
            //매수 진행 코드 작성
            upbitTrade(symbol, "bid", qty);
            sendMessage(
              `업비트 ${symbol} 총 가격:${price * qty}KRW, ${qty}개 매수 진행`,
              true
            );
          } else {
            let msg = `업비트 ${symbol}매수 종료`;
            if (parseFloat(balance.BTC.available) < price * qty) {
              msg = `업비트 KRW 잔액 ${symbol}부족 매수 취소`;
            }
            sendMessage(msg, true);
            break;
          }
        }
      }
    }
    res.json(checkNewNotices);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const postBinanceNotice = async (req, res, next) => {
  try {
    const {
      body: { notices },
    } = req;
    for (let i = 0; i < notices.length; i++) {
      const notice = await binanceNoticeModel.findOne({
        title: notices[i].notice.title,
      });
      if (notice.checked === false) {
        const coin = notice.coin; //매수할 코인
        notice.checked = true;
        notice.save();
        //매수 작업 진행
        //console.log(`Binance ${coin} 매수`);
        sendMessage(`바이낸스: ${notices[i].notice.title}`, true);
      }
    }
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
