//import ccxt from "ccxt";
//import "@babel/polyfill";
//import { sendMessage, bot, chatId } from "./controllers/botController";
//import { getCoinList } from "./coinList";
//import axios from "axios";

/*let currentRate = 0,
  currentSymbol = "All",
  alarmStarted = false;
const getCurreny = () => {
  const result = axios.get(
    `https://ko.valutafx.com/LookupRate.aspx?to=KRW&from=USD&amount=1&offset=-540&fi=`
  );
  return result;
};
const getUpbitBtcKrw = () => {
  const result = axios.get(`https://api.upbit.com/v1/ticker?markets=KRW-BTC`);
  return result;
};
const getBinanceBtcUsd = () => {
  const result = axios.get(
    `https://www.binance.us/api/v1/aggTrades?limit=1&symbol=BTCUSD`
  );
  return result;
};
/*const getHuobiExchangeRate = () => {
  const result = axios.get(
    `https://www.huobi.com/-/x/general/exchange_rate/list?r=2hdwx1k4n72`
  );
  return result;
};
const filterHuobiData = data => {
  const filteredData = data.filter(
    v => v.name === "cny_krw" || v.name === "btc_cny"
  );
  return { btccny: filteredData[1].rate, cnykrw: filteredData[0].rate };
};*/
//export const watchingCoin = (coin, percent) => {
//console.log(coin, percent);
//};

/*const requestCoinInfo = async (base = "", symbol = "All") => {
  try {
    const upbit = new ccxt.upbit(),
      binance = new ccxt.binance();
    //huobi = new ccxt.huobipro();
    const coinList = getCoinList();
    const info = await Promise.all([
      await upbit.fetchTickers(coinList["krw"]),
      await binance.fetchTickers(coinList["btc"])
      //await huobi.fetchTickers(coinList["btc"])
    ])
      .then(data => {
        const [upbitdata, binancedata, huobidata] = data;
        const upbit_data = Object.entries(upbitdata)
          .filter(v => v[0].includes("/KRW"))
          .sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
        const binance_data = Object.entries(binancedata)
          .filter(v => v[0].includes("/BTC"))
          .sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
        //const huobi_data = Object.entries(huobidata)
        //.filter(v => v[0].includes("/BTC"))
        //.sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
        //console.log(huobi_data.length, binance_data.length, upbit_data.length);
        return {
          upbit: { data: upbit_data },
          binance: { data: binance_data }
          //huobi: { data: huobi_data }
        };
      })
      .catch(e => {
        console.log(e);
      });
    if (currentSymbol !== symbol) {
      currentRate = 0;
      currentSymbol = symbol;
    }
    return info;
  } catch (e) {
    console.error(e);
  }
};

const socket = io => {
  io.on("connection", socket => {
    //socket 연결
    console.log("Socket Connected");
    socket.on("updateInfo", async payload => {
      io.emit("updateInfo", data);
    });
    socket.on("settingAlarm", payload => {
      io.emit("settingAlarm", payload);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
export default socket;*/
"use strict";