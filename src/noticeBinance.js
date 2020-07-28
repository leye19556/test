import { sendMessage } from "./controllers/botController";
import puppeteer from "puppeteer";
import moment from "moment";
import binanceNoticeModel from "./models/binanceNoticeModel";
import {
  getUpbitBalance,
  checkLatestPrice,
  upbitTrade,
  upbit,
  checkExist,
} from "./controllers/TradeController";
const URL = "https://www.binance.com/en/support/announcement/c-48";
let timer = null;
const extractSymbol = (title) => {
  let symbol = "";
  for (let i = 0; i < title.length; i++) {
    if (title.charCodeAt(i) >= 65 && title.charCodeAt(i) <= 90) {
      symbol += title.charAt(i);
    } else {
      if (symbol.length > 1) break;
      symbol = "";
    }
  }
  return symbol;
};
const binanceListing = async () => {
  try {
    //console.log("binance checking");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"
    );
    await page.goto(`${URL}`, { waitUntil: "networkidle2" });
    await page.waitForSelector(
      "#__APP > div > div > div > div > div.css-deb3qh > div.css-1oz0ry0 > div.css-vurnku"
    );
    const listing = await page.$$eval(
      "#__APP > div > div > div > div > div.css-deb3qh > div.css-1oz0ry0 > div.css-vurnku > div.css-6f91y1 > div > a",
      (items) => {
        return items.map((item) => {
          const title = item.textContent.trim(),
            link = item.href;
          if (title.includes("Will List")) {
            return { title, link, coin: true };
          } else {
            return { title, link, coin: false };
          }
        });
      }
    );
    [].forEach.call(listing, async (item) => {
      if (item.coin === true) {
        const symbol = extractSymbol(item.title); //코인 심볼 추출
        const notice = await binanceNoticeModel.findOne({ title: item.title });
        if (!notice) {
          await binanceNoticeModel.create({
            coin: symbol,
            title: item.title,
            link: item.link,
            updatedAt: moment().format("YYYY/MM/DD"),
          });
          //console.log("binance");
          sendMessage(`바이낸스 업데이트: ${item.title}`, true, "binance");
          if (upbit) {
            if ((await checkExist(symbol, "upbit")) === true) {
              const {
                data: { orderbook_units },
              } = checkLatestPrice(symbol, "upbit");
              const { ask_price, ask_size } = orderbook_units[0];
              limitPrice = parseFloat(
                (parseFloat(ask_price) * 0.05 + parseFloat(ask_price)).toFixed(
                  8
                )
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
                  //upbitTrade(symbol, "bid", qty);
                  sendMessage(
                    `업비트 ${symbol} 총 가격:${
                      price * qty
                    }KRW, ${qty}개 매수 진행`,
                    true,
                    "binance"
                  );
                } else {
                  let msg = `업비트 ${symbol}매수 종료`;
                  if (parseFloat(balance.BTC.available) < price * qty) {
                    msg = `업비트 KRW 잔액 ${symbol}부족 매수 취소`;
                  }
                  sendMessage(msg, true, "binance");
                  break;
                }
              }
            }
          }
        }
      }
    });
    await page.close();
    await browser.close();
  } catch (e) {
    console.log(e);
  }
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      binanceListing();
    }, 3000);
  }
};
binanceListing();
