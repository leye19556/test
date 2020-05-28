import request from "request";
import { v4 } from "uuid";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import queryString from "querystring";
import axios from "axios";
import Binance from "node-binance-api";
import { sendMessage } from "./botController";
/**
 * 햔재 가격의 코인 양이 설정된 값이랑 같거나 이상일 경우를 확인 해주며 거래 진행
 * 적을 거래 취소, 거래 코인은 여러개 설정할수 있게,
 * upbit는 krw, 바이낸스는 btc
 */
const UPBIT_API = "22bb6xhjM7YndAsQ84TYEOD071DWhyCoxrASRWSR";
const UPBIT_SEC = "sctWwG494PzxglGGs78MxtIWkcmWhO7RtNeoy7le";
const BINANCE_API =
  "9Z02YXaX43ad1JLg1ZkETbpLH3mEhcmQ5BtToNGTFCNbpWPDYEawBwirk6esQsOl";
const BINANCE_SEC =
  "fGSmq5Xux2rnQhxOROcSRqyzZrzyYm25ipZltqrmmm1wfnHRLxWbyJWsAaRCodwe";
const binance = new Binance({
  APIKEY: BINANCE_API,
  APISECRET: BINANCE_SEC,
});
let flag = 1;
export const getBalance = async () => {
  //binance 지갑 체크
  const r = await binance.balance();
  return r;
};
export const checkBinancePrice = async (symbol, type) => {
  const { asks, bids } = await binance.depth(`${symbol}BTC`);
  let obj = {};
  if (type === "ask") {
    // console.log(Object.entries(asks));
    obj = Object.entries(asks).map((price) => {
      return { askPrice: parseFloat(price[0]), askQty: price[1] };
    });
  } else if (type === "bid") {
    obj = Object.entries(bids).map((price) => {
      return { bidPrice: parseFloat(price[0]), bidQty: price[1] };
    });
  }
  return obj;
};
export const checkBinanceLatestPrice = (symbol) => {
  let obj = {};
  obj = binance.bookTickers(`${symbol}BTC`);
  return obj;
};
const orderChange = async () => {
  const body = {
    market: "KRW-OST",
  };
  const query = queryString.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: UPBIT_API,
    nonce: v4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };

  const token = jsonwebtoken.sign(payload, UPBIT_SEC);
  const options = {
    method: "GET",
    url: "https://api.upbit.com/v1/orders/chance?" + query,
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };
  const {
    data: {
      market: { ask, bid },
    },
  } = await axios.get("https://api.upbit.com/v1/orders/chance?" + query, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { ask, bid };
};
const checkWallet = async () => {
  const server_url = "https://api.upbit.com";
  const payload = {
    access_key: UPBIT_API,
    nonce: v4(),
  };
  const token = jsonwebtoken.sign(payload, UPBIT_SEC);

  const options = {
    method: "GET",
    url: server_url + "/v1/accounts",
    headers: { Authorization: `Bearer ${token}` },
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    console.log(body);
  });
};
const checkTradable = async (symbol, type, q) => {
  const b = await axios.get(
    `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}BTC`,
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  const u = await axios.get(
    `https://api.upbit.com/v1/orderbook?markets=KRW-${symbol}`,
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  if (type === "ask") {
    //upbit ask,  binance bid
    const bidQty = parseFloat(b.data.askQty, 10),
      askQty = parseFloat(u.data[0].orderbook_units[0].bid_size, 10);
    if (bidQty >= q && askQty >= q) return true;
  } else if (type === "bid") {
    //upbit bid,  binance ask
    const askQty = parseFloat(b.data.bidQty, 10),
      bidQty = parseFloat(u.data[0].orderbook_units[0].ask_size, 10);
    if (askQty >= q && bidQty >= q) return true;
  }
  return false;
};
const getUpbitBidPrice = async (symbol) => {
  const { data } = await axios.get(
    `https://api.upbit.com/v1/orderbook?markets=KRW-${symbol}`
  );
  const info = data[0].orderbook_units[0];
  return { price: info.bid_price, quantity: info.bid_size };
};
export const binanceTrade = async (symbol, side, q) => {
  if (side === "ask") {
    //코인 매도
    flag = binance.marketSell(`${symbol}BTC`, q, (err, response) => {
      if (err && err.body) {
        console.log("ask", err.body);
      } else {
        console.info("Market Buy response", response);
        console.info("order id: " + response.orderId);
      }
    });
  } else if (side === "bid") {
    //코인 매수
    flag = binance.marketBuy(`${symbol}BTC`, q, (err, response) => {
      if (err && err.body) {
        console.log("bid", err.body);
      } else {
        console.info("Market Buy response", response);
        console.info("order id: " + response.orderId);
      }
    });
  }
  return flag;
};
export const upbitTrade = async (symbol, side, q) => {
  let body = {
    market: `KRW-${symbol}`,
    side,
  };
  if (side === "ask") {
    //sell 매도
    body.price = null;
    body.volume = q;
    body.ord_type = "market";
  } else if (side === "bid") {
    //buy 매수
    const bidInfo = await getUpbitBidPrice(symbol);
    body.price = bidInfo.price * q;
    body.volume = null;
    body.ord_type = "price";
  }
  const query = queryString.encode(body);
  const hash = crypto.createHash("sha512");
  const queryHash = hash.update(query, "utf-8").digest("hex");
  const payload = {
    access_key: UPBIT_API,
    nonce: v4(),
    query_hash: queryHash,
    query_hash_alg: "SHA512",
  };
  const token = jsonwebtoken.sign(payload, UPBIT_SEC);
  const options = {
    method: "POST",
    url: "https://api.upbit.com/v1/orders",
    headers: { Authorization: `Bearer ${token}` },
    json: body,
  };

  try {
    request(options, (error, response, body) => {
      if (error) {
        throw new Error(error);
      }
      console.log(body);
    });
  } catch (e) {
    console.log(e);
  }
};
export const upbitBidBinanceAsk = async (req, res, next) => {
  try {
    const {
      body: { symbol, q },
    } = req;
    if (checkTradable(symbol, "bid", q)) {
      //console.log("업비트 bid 바이낸스 ask");
      Promise.all([
        await upbitTrade(symbol, "bid", q),
        await binanceTrade(symbol, "ask", q),
      ]);
    } else {
      //거래 취소
      sendMessage(`${symbol} volumn:${q} 거래 불가`, true);
    }
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const binanceBidUpbitAsk = async (req, res, next) => {
  try {
    const {
      body: { symbol, q },
    } = req;
    console.log(await orderChange());
    if (checkTradable(symbol, "ask", q)) {
      Promise.all([
        await upbitTrade(symbol, "ask", q),
        await binanceTrade(symbol, "bid", q),
      ]);
    } else {
      //거래 취소
      sendMessage(`${symbol} volumn:${q} 거래 불가`, true);
    }
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
