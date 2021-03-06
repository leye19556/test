import axios from "axios";
import moment from "moment";
import { sendMessage } from "./controllers/botController";
import upbitNoticeModel from "./models/upbitNoticeModel";
import {
  binanceTrade,
  checkLatestPrice,
  getBinanceBalance,
  binance,
} from "./controllers/TradeController";
import binanceCoinModel from "./models/binanceCoinModel";
let timer = null;

const isExist = async (symbol) => {
  try {
    const coin = await binanceCoinModel.findOne({ name: `${symbol}BTC` });
    if (coin) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

//새 코인 공지시 코인 구매 진행
const bidBinance = async (symbol) => {
  if (binance) {
    if ((await isExist(symbol)) === true) {
      const { bidPrice, bidQty, askPrice, askQty } = await checkLatestPrice(
        symbol,
        "binance"
      );
      let balance = await getBinanceBalance(),
        limitPrice = parseFloat(
          (parseFloat(askPrice) * 0.03 + parseFloat(askPrice)).toFixed(8)
        );
      sendMessage(`[바이낸스] ${symbol}매수 시도`, true, "upbit");
      while (true) {
        const { askPrice: price, askQty: qty } = await checkLatestPrice(
          symbol,
          "binance"
        );
        balance = await getBinanceBalance(); //BTC 잔액 확인
        if (
          //3% 범위에 포함되는지 체크, 총량을 매수가능한지 지갑 체크
          parseFloat(price) <= limitPrice &&
          parseFloat(balance.BTC.available) >= price * qty
        ) {
          //코인 해당 매도가 전량 매수
          //console.log(`총 가격:${price * qty}BTC, ${qty}개 매수 진행`);
          sendMessage(
            `바이낸스 ${symbol} 총 가격:${price * qty}BTC, ${qty}개 매수 진행`,
            true,
            "upbit"
          );
          binanceTrade(symbol, "bid", qty);
        } else {
          let msg = `바이낸스 ${symbol}매수 종료`;
          if (parseFloat(balance.BTC.available) < price * qty) {
            msg = `바이낸스 BTC 잔액 부족 ${symbol} 매수 취소`;
          }
          sendMessage(msg, true, "upbit");
          break;
        }
      }
    } else {
      sendMessage(
        `[${symbol}은 바이낸스에 상장하지 않은 코인 입니다]`,
        true,
        "upbit"
      );
    }
  }
};
const upbitListing = async () => {
  try {
    const {
      data: { data },
    } = await axios.get(
      "https://api-manager.upbit.com/api/v1/notices?page=1&per_page=20&thread_name=general"
    );
    const notices = data.list;
    for (let i = 0; i < notices.length; i++) {
      if (
        notices[i].title.includes("[거래] 원화") ||
        (notices[i].title.includes("[이벤트]") &&
          notices[i].title.includes("원화마켓"))
      ) {
        if (
          notices[i].title.includes("[거래] 원화") &&
          notices[i].title.includes("신규") &&
          notices[i].title.includes("상장")
        ) {
          const title = notices[i].title;
          const symbols = title
            .slice(title.indexOf("(") + 1, title.indexOf(")"))
            .split(/[,\sㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g)
            .filter((w) => w.length !== 0);
          symbols.forEach(async (symbol) => {
            const notice = await upbitNoticeModel.findOne({
              coin: symbol,
            });
            if (
              !notice &&
              moment().format("YYYY-MM-DD HH:mm:00") ===
                moment(notices[i].created_at).format("YYYY-MM-DD HH:mm:00")
            ) {
              sendMessage(`업비트 업데이트: ${title}`, true, "upbit");
              await upbitNoticeModel.create({
                title: title,
                coin: symbol,
                keyword: "[거래]",
                updatedAt: notices[i].updated_at,
                createdAt: notices[i].created_at,
                checked: true,
              });
              //if (title.endsWith(")")) await bidBinance(symbol);
            }
          });
        } else if (
          notices[i].title.includes("[이벤트]") &&
          notices[i].title.includes("원화마켓") &&
          notices[i].title.includes("오픈") &&
          !notices[i].title.includes("결과") &&
          !notices[i].title.includes("당첨") &&
          !notices[i].title.includes("안내")
        ) {
          const title = notices[i].title;
          const symbol = title
            .slice(title.indexOf("(") + 1, title.indexOf(")"))
            .split(/[,\sㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g)
            .filter((w) => w.length !== 0)[0];
          if (
            moment().format("YYYY-MM-DD HH:mm:00") ===
            moment(notices[i].created_at).format("YYYY-MM-DD HH:mm:00")
          ) {
            const notice = await upbitNoticeModel.findOne({
              coin: symbol,
            });
            if (!notice) {
              sendMessage(`업비트 업데이트: ${title}`, true, "upbit");
              await upbitNoticeModel.create({
                title: title,
                coin: symbol,
                keyword: "[이벤트]",
                updatedAt: notices[i].updated_at,
                createdAt: notices[i].created_at,
                checked: true,
              });
              //await bidBinance(symbol);
            }
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        upbitListing();
      }, 3000);
    }
  }
};
upbitListing();
