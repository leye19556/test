import binanceNoticeModel from "../models/binanceNoticeModel";
import upbitNoticeModel from "../models/upbitNoticeModel";
import "@babel/polyfill";
import { sendMessage } from "./botController";

export const getUpbitNotice = async (req, res, next) => {
  try {
    const notices = await upbitNoticeModel
      .find()
      .sort({ updatedAt: -1 })
      .limit(20);
    res.json(notices);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getBinanceNotice = async (req, res, next) => {
  try {
    const notices = await binanceNoticeModel.find().sort({ updatedAt: -1 });
    res.json(notices);
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
