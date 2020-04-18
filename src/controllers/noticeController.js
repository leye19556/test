import moment from "moment";
import binanceNoticeModel from "../models/binanceNoticeModel";
import upbitNoticeModel from "../models/upbitNoticeModel";
import "@babel/polyfill";
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
        console.log(`Binance ${coin} 매수`);
      }
    }
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const postUpbitNotice = async (req, res, next) => {
  try {
    const {
      body: { notices },
    } = req;
    for (let i = 0; i < notices.length; i++) {
      const symbol = notices[i].notice.title.slice(
        notices[i].notice.title.lastIndexOf(" ") + 1,
        notices[i].notice.title.length - 1
      );
      const notice = await upbitNoticeModel.findOne({
        coin: symbol,
      });
      //console.log(notice);
      if (!notice) {
        await upbitNoticeModel.create({
          title: notices[i].notice.title,
          coin: symbol,
          updatedAt: notices[i].notice.updated_at,
          createdAt: notices[i].notice.created_at,
          checked: true,
        });
        //오늘 새로운 상장 코인, 코인 매수 작업 진행
        console.log(`Upbit ${symbol} 매수`);
      }
    }
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
