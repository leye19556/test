import axios from "axios";
import { sendMessage } from "./controllers/botController";
import upbitNoticeModel from "./models/upbitNoticeModel";
import {
  binanceTrade,
  checkLatestPrice,
  getBinanceBalance,
  checkExistOnBinance,
} from "./controllers/TradeController";
let timer = null;
//새 코인 공지시 코인 구매 진행

const upbitListing = async () => {
  const {
    data: { data },
  } = await axios.get(
    "https://api-manager.upbit.com/api/v1/notices/search?search=%5B%EA%B1%B0%EB%9E%98%5D&page=1&per_page=20&before=&target=non_ios&thread_name=general"
  );
  const notices = data.list;
  for (let i = 0; i < notices.length; i++) {
    const symbol = notices[i].title.slice(
      notices[i].title.lastIndexOf(" ") + 1,
      notices[i].title.length - 1
    );
    const notice = await upbitNoticeModel.findOne({
      coin: symbol,
    });
    //console.log(symbol, notices[i]);
    if (!notice) {
      await upbitNoticeModel.create({
        title: notices[i].title,
        coin: symbol,
        updatedAt: notices[i].updated_at,
        createdAt: notices[i].created_at,
        checked: true,
      });
      if (checkExistOnBinance(symbol) === true) {
        const { bidPrice, bidQty, askPrice, askQty } = await checkLatestPrice(
          symbol,
          "binance"
        );
        //await checkBinancePrice(symbol, "ask");
        let balance = await getBinanceBalance(),
          limitPrice = parseFloat(
            (parseFloat(askPrice) * 0.02 + parseFloat(askPrice)).toFixed(8)
          );
        sendMessage(
          `업비트 업데이트: ${notices[i].title}\n[바이낸스] ${symbol}매수 시도`,
          true
        );
        //binance에서 구매 진행
        /*console.log(
        balance.BTC.available,
        askPrice,
        askQty,
        limitPrice,
        askPrice * askQty
      );*/
        while (true) {
          const { askPrice: price, askQty: qty } = await checkLatestPrice(
            symbol,
            "binance"
          );
          balance = await getBinanceBalance(); //BTC 잔액 확인
          if (
            //2% 범위에 포함되는지 체크, 총량을 매수가능한지 지갑 체크
            parseFloat(price) <= limitPrice &&
            parseFloat(balance.BTC.available) >= price * qty
          ) {
            //코인 해당 매도가 전량 매수
            //console.log(`총 가격:${price * qty}BTC, ${qty}개 매수 진행`);
            sendMessage(
              `바이낸스 ${symbol} 총 가격:${
                price * qty
              }BTC, ${qty}개 매수 진행`,
              true
            );
            binanceTrade(symbol, "bid", qty);
          } else {
            let msg = `바이낸스 ${symbol}매수 종료`;
            if (parseFloat(balance.BTC.available) < price * qty) {
              msg = `바이낸스 BTC 잔액 부족 ${symbol} 매수 취소`;
            }
            sendMessage(msg, true);
            break;
          }
        }
      }
    }
  }
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(upbitListing, 2000);
};
timer = setTimeout(upbitListing, 2000);
