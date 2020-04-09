import ccxt from "ccxt";
import "@babel/polyfill";
import { sendMessage, bot, chatId } from "./controllers/botController";
import { getCoinList } from "./coinList";
import axios from "axios";
let currentRate = 0,
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
const getHuobiExchangeRate = () => {
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
};
//export const watchingCoin = (coin, percent) => {
//console.log(coin, percent);
//};
const requestCoinInfo = async (base = "", symbol = "All") => {
  try {
    const upbit = new ccxt.upbit(),
      binance = new ccxt.binance(),
      huobi = new ccxt.huobipro();
    const coinList = getCoinList();
    const info = await Promise.all([
      await upbit.fetchTickers(coinList["krw"]),
      await binance.fetchTickers(coinList["btc"]),
      await huobi.fetchTickers(coinList["btc"])
    ])
      .then(data => {
        const [upbitdata, binancedata, huobidata] = data;
        const upbit_data = Object.entries(upbitdata)
          .filter(v => v[0].includes("/KRW"))
          .sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
        const binance_data = Object.entries(binancedata)
          .filter(v => v[0].includes("/BTC"))
          .sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
        const huobi_data = Object.entries(huobidata)
          .filter(v => v[0].includes("/BTC"))
          .sort((x, y) => (x[0].split("/")[0] > y[0].split("/")[0] ? 1 : -1));
        //console.log(huobi_data.length, binance_data.length, upbit_data.length);
        return {
          upbit: { data: upbit_data },
          binance: { data: binance_data },
          huobi: { data: huobi_data }
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
const getCoinInfo = async (base, symbol, percent) => {
  const result = await requestCoinInfo(base, symbol);
  const usd_krw = await getCurreny(),
    btc_usd = await getBinanceBtcUsd(),
    btc_krw = await getUpbitBtcKrw(),
    btc_huobi = await getHuobiExchangeRate();
  //console.log(btc_huobi.data.data);
  if (currentSymbol !== "ALL" && alarmStarted)
    checkDataAndSend(
      result,
      usd_krw.data.Rate.split(",").join(""),
      btc_usd.data[0].p,
      btc_krw.data[0].trade_price,
      symbol,
      percent
    );
  return {
    upbit: {
      upbit_data: result.upbit.data,
      binance_data: result.binance.data,
      huobi_data: result.huobi.data,
      btc_krw: btc_krw.data[0].trade_price,
      usd_krw: usd_krw.data.Rate.split(",").join(""),
      btc_usd: btc_usd.data[0].p,
      huobi_rate: filterHuobiData(btc_huobi?.data?.data)
    }
  };
};

const rateCalculator = (upbit, binance, btc_krw) => {
  //const binanceKrw = (btc_usd * usd_krw).toFixed(0); //Binance BTC/KRW
  const rate = (upbit[1].last - binance[1].last * btc_krw) / upbit[1].last;
  return rate * 100;
};
const checkDataAndSend = (data, usd_krw, btc_usd, btc_krw, symbol, percent) => {
  const { upbit, binance } = data;
  const coinName = `${symbol}`.toUpperCase();
  const upbitCoinInfo = upbit.data.filter(v => v[0] === `${coinName}/KRW`)[0];
  const binanceCoinInfo = binance.data.filter(
    v => v[0] === `${coinName}/BTC`
  )[0];
  const binanceKrw = btc_usd * usd_krw;
  const upbit_binance = rateCalculator(
    upbitCoinInfo,
    binanceCoinInfo,
    btc_krw
  ).toFixed(2);
  if (
    Math.abs(upbit_binance) >= percent &&
    currentRate !== Math.abs(upbit_binance)
  ) {
    console.log(`${symbol} binance와 upbit 차이:${Math.abs(upbit_binance)}%`);
    currentRate = Math.abs(upbit_binance);
    sendMessage(
      `${symbol}\n업비트:${upbitCoinInfo[1].last}₩\n바이낸스:${(
        binanceCoinInfo[1].last * btc_krw
      ).toFixed(2)}₩  (${upbit_binance * -1}%)`,
      true
    );
  }
};
const settingAlarmBot = ({ started, coin, percent }) => {
  let resp = ``;
  if (started)
    resp = `[코인알림 설정 완료]\n코인: ${coin.toUpperCase()} 가격차이: ${percent}% 이상 시 알림`;
  else resp = `[코인알림 취소 완료]`;
  bot.sendMessage(chatId, resp);
  alarmStarted = started;
};
const socket = io => {
  io.on("connection", socket => {
    //socket 연결
    console.log("Socket Connected");
    socket.on("updateInfo", async payload => {
      const data = await getCoinInfo(
        payload.base,
        payload.symbol,
        payload.percent
      );
      io.emit("updateInfo", data);
    });
    socket.on("settingAlarm", payload => {
      io.emit("settingAlarm", payload);
      settingAlarmBot(payload);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
export default socket;
