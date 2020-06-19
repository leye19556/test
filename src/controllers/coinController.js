import coinModel from "../models/coinModel";
import axios from "axios";
import WebSocket from "ws";
let wsBinance = null,
  wsUpbit = null,
  wsBithumb = null,
  coinList = [],
  tickers1 = {},
  tickers2 = {},
  tickers3 = {};
const upbitWS = async () => {
  if (wsUpbit === null) {
    const upbitList = (
      await axios.get("https://api.upbit.com/v1/market/all")
    ).data.filter(
      (coin) =>
        coin.market.includes("KRW") && coinList.includes(coin.market.slice(4))
    );
    wsUpbit = new WebSocket("wss://api.upbit.com/websocket/v1");
    wsUpbit.binaryType = "arraybuffer";
    wsUpbit.onopen = () => {
      console.log("u connected");
      const data = [
        { ticket: "test" },
        { type: "ticker", codes: upbitList.map((coin) => `${coin.market}`) },
      ];
      wsUpbit.send(JSON.stringify(data));
    };
    wsUpbit.onmessage = (e) => {
      const enc = new TextDecoder("utf-8");
      const arr = new Uint8Array(e.data);
      const { code, trade_price } = JSON.parse(enc.decode(arr));
      const symbol = code.slice(code.indexOf("-") + 1, code.length);
      tickers1[symbol] = trade_price;
    };
    wsUpbit.onclose = () => {
      if (wsUpbit !== null) {
        wsUpbit.close();
        wsUpbit = null;
      }
    };
  }
};
const binanceWS = async () => {
  if (wsBinance === null) {
    let streams = "";
    for (let i = 0; i < coinList.length; i++) {
      if (i < coinList.length - 1) {
        streams += `${coinList[i].toLowerCase()}btc@ticker/`;
      } else streams += `${coinList[i].toLowerCase()}btc@ticker`;
    }
    wsBinance = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}` //ethbtc@ticker" //"
    );
    wsBinance.onopen = () => {
      console.log("b connected");
    };
    wsBinance.onmessage = (e) => {
      const {
        data: { s, c },
      } = JSON.parse(e.data);
      const symbol = s.slice(0, s.length - 3);
      tickers2[symbol] = parseFloat(c);
    };
    wsBinance.onclose = () => {
      if (ws !== null) {
        wsBinance.close();
        wsBinance = null;
      }
    };
  }
};
const bithumbWS = async () => {
  if (wsBithumb === null) {
    const bithumbList = Object.keys(
      (await axios.get("https://api.bithumb.com/public/orderbook/ALL")).data
        .data
    ).slice(2);
    wsBithumb = new WebSocket(`wss://pubwss.bithumb.com/pub/ws`);
    wsBithumb.onopen = () => {
      console.log("t connected");
      const data = {
        type: "ticker",
        symbols: bithumbList.map((coin) => `${coin}_KRW`),
        tickTypes: ["30M", "1H"],
      };
      wsBithumb.send(JSON.stringify(data));
    };
    wsBithumb.onmessage = (e) => {
      const { data } = e;
      if (data) {
        const info = JSON.parse(data);
        const symbol = info?.content?.symbol.slice(
          0,
          info?.content?.symbol.length - 4
        );
        tickers3[symbol] = parseFloat(info?.content?.closePrice);
      }
    };
    wsBithumb.onclose = () => {
      if (wsBithumb !== null) {
        wsBithumb.close();
        wsBithumb = null;
      }
    };
    wsBithumb.onerror = (e) => {
      console.log(e);
    };
  }
};
export const getTickers = async (req, res, next) => {
  try {
    coinList = (await coinModel.find())?.map((coin) => coin.name);
    if (coinList.length > 0) {
      upbitWS();
      binanceWS();
      bithumbWS();
    }
    const tickers = coinList.map((v) => {
      return {
        symbol: v, //tickers1[`${v}/KRW`].symbol.slice(0, tickers1[v].symbol.indexOf("/")),
        last: tickers1[`${v}`] === undefined ? 0 : tickers1[`${v}`],
        blast: tickers2[`${v}`] === undefined ? 0 : tickers2[`${v}`],
        thumb: tickers3[`${v}`] === undefined ? 0 : tickers3[`${v}`],
      };
    });

    res.json(tickers);
  } catch (e) {
    next(e);
  }
};

export const getCoins = async (req, res, next) => {
  try {
    const coins = await coinModel.find().sort({ name: 1 });
    res.json(coins);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const postCoin = async (req, res, next) => {
  try {
    const {
      body: { name },
    } = req;
    const coinName = name.toUpperCase();
    const coin = await coinModel.findOne({
      name: coinName,
    });
    if (coin) {
      return res
        .status(404)
        .json({ success: 0, msg: "코인이 이미 존재합니다" });
    }
    await coinModel.create({
      name: coinName,
    });
    res.redirect("/admin");
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const deleteCoin = async (req, res, next) => {
  try {
    const {
      body: { name },
    } = req;
    const coin = await coinModel.findOneAndDelete({
      name: name.trim(),
    });
    console.log(coin);
    if (!coin) {
      res
        .status(404)
        .json({ error: 1, msg: "코인이름이 db에 존재하지 않습니다" });
    } else {
      res.status(200).json({ error: 0, msg: "삭제 완료" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const editCoin = async (req, res, next) => {
  try {
    const {
      body: { id, name },
    } = req;
    await coinModel.findByIdAndUpdate(id, { name });
    res.status(200).json();
  } catch (e) {
    next(e);
  }
};

export const checkCoin = async (req, res, next) => {
  try {
    const {
      body: { coins },
    } = req;
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const getCurrency = async (req, res, next) => {
  try {
    const { data } = await axios.get(
      "https://www.freeforexapi.com/api/live?pairs=USDKRW"
    );
    res.json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
