import axios from "axios";
import {
  checkBot,
  coinPercent,
  sendMessage,
} from "./controllers/botController";
import {
  upbitBTCKrw,
  tickers1,
  tickers2,
  tickers3,
  coinList,
  getPercent,
} from "./controllers/coinController";
let percent = {};
let timer = null,
  tickers = [],
  usdKrw = 0;
const getCurrency = async () => {
  const { data } = await axios.get(
    "https://www.freeforexapi.com/api/live?pairs=USDKRW"
  );
  usdKrw = data.rates.USDKRW.rate;
};
const startBot = () => {
  if (
    Object.keys(tickers1).length > 0 ||
    Object.keys(tickers2).length > 0 ||
    Object.keys(tickers3).length > 0
  ) {
    tickers = ["BTC", ...coinList].map((v) => {
      if (v !== "BTC") {
        return {
          symbol: v, //tickers1[`${v}/KRW`].symbol.slice(0, tickers1[v].symbol.indexOf("/")),
          last: tickers1[`${v}`] === undefined ? 0 : tickers1[`${v}`],
          blast: tickers2[`${v}`] === undefined ? 0 : tickers2[`${v}`],
          convertedBlast:
            tickers2[`${v}`] === undefined
              ? 0
              : parseFloat((tickers2[`${v}`] * upbitBTCKrw).toFixed(2), 10),
          thumb: tickers3[`${v}`] === undefined ? 0 : tickers3[`${v}`],
          per1:
            tickers1[`${v}`] === undefined || tickers2[`${v}`] === undefined
              ? undefined
              : getPercent(
                  tickers1[`${v}`],
                  parseFloat((tickers2[`${v}`] * upbitBTCKrw).toFixed(2), 10)
                ),
          per2:
            tickers3[`${v}`] === undefined || tickers2[`${v}`] === undefined
              ? undefined
              : getPercent(
                  tickers3[`${v}`],
                  parseFloat((tickers2[`${v}`] * upbitBTCKrw).toFixed(2), 10)
                ),
        };
      } else {
        return {
          symbol: v, //tickers1[`${v}/KRW`].symbol.slice(0, tickers1[v].symbol.indexOf("/")),
          last: tickers1[`${v}`] === undefined ? 0 : tickers1[`${v}`],
          blast: tickers2[`${v}`] === undefined ? 0 : tickers2[`${v}`] * usdKrw,
          convertedBlast:
            tickers2[`${v}`] === undefined
              ? 0
              : parseFloat((tickers2[`${v}`] * usdKrw).toFixed(2), 10),
          thumb: tickers3[`${v}`] === undefined ? 0 : tickers3[`${v}`],
          per1:
            tickers1[`${v}`] === undefined || tickers2[`${v}`] === undefined
              ? undefined
              : getPercent(
                  tickers1[`${v}`],
                  parseFloat((tickers2[`${v}`] * usdKrw).toFixed(2), 10)
                ),
          per2:
            tickers3[`${v}`] === undefined || tickers2[`${v}`] === undefined
              ? undefined
              : getPercent(
                  tickers3[`${v}`],
                  parseFloat((tickers2[`${v}`] * usdKrw).toFixed(2), 10)
                ),
        };
      }
    });
  }
  if (checkBot === true) {
    if (Object.keys(coinPercent).length > 0) {
      tickers.forEach((ticker) => {
        if (
          coinPercent[ticker.symbol] !== undefined &&
          ((ticker.per1 !== undefined &&
            Math.abs(ticker.per1) > coinPercent[ticker.symbol]) ||
            (ticker.per2 !== undefined &&
              Math.abs(ticker.per2) > coinPercent[ticker.symbol]))
        ) {
          if (percent[ticker.symbol] === undefined) {
            percent[ticker.symbol] = {
              per1:
                ticker.per1 !== undefined ? ticker.per1.toFixed(2) : undefined,
              per2:
                ticker.per2 !== undefined ? ticker.per2.toFixed(2) : undefined,
            };
            let msg = `[${ticker.symbol}]`;
            if (ticker.per1 !== undefined) {
              msg += `업비트:${ticker.last}₩ 바이낸스:${
                ticker.convertedBlast
              }₩  (${ticker.per1.toFixed(2)}%) `;
            }
            if (ticker.per2 !== undefined) {
              msg += `빗썸:${ticker.thumb}₩ 바이낸스:${
                ticker.convertedBlast
              }₩ (${`${ticker.per2.toFixed(2)}%`})`;
            }
            sendMessage(msg, true);
          } else {
            if (
              (ticker.per1 !== undefined &&
                parseFloat(percent[ticker.symbol].per1, 10) !==
                  parseFloat(ticker.per1.toFixed(2), 10)) ||
              (ticker.per2 !== undefined &&
                parseFloat(percent[ticker.symbol].per2, 10) !==
                  parseFloat(ticker.per2.toFixed(2), 10))
            ) {
              percent[ticker.symbol] = {
                per1:
                  ticker.per1 !== undefined
                    ? ticker.per1.toFixed(2)
                    : undefined,
                per2:
                  ticker.per2 !== undefined
                    ? ticker.per2.toFixed(2)
                    : undefined,
              };
              let msg = `[${ticker.symbol}]`;
              if (ticker.per1 !== undefined) {
                msg += `업비트:${ticker.last}₩ 바이낸스:${
                  ticker.convertedBlast
                }₩  (${ticker.per1.toFixed(2)}%) `;
              }
              if (ticker.per2 !== undefined) {
                msg += `빗썸:${ticker.thumb}₩ 바이낸스:${
                  ticker.convertedBlast
                }₩ (${`${ticker.per2.toFixed(2)}%`})`;
              }
              sendMessage(msg, true);
            }
          }
        }
      });
    }
  } else {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      startBot();
      getCurrency();
    }, 1000);
  }
  if (!timer) {
    timer = setTimeout(() => {
      timer = null;
      startBot();
      getCurrency();
    }, 1000);
  }
};
startBot();
