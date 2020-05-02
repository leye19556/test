//매수:bid:sell 매도:ask:buy
import ccxt from "ccxt";
import request from "request";
import { v4 } from "uuid";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import queryString from "querystring";
import axios from "axios";
import Binance from "node-binance-api";
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
const binanceTrade = async (symbol, side) => {
  const binance = new Binance({
    APIKEY: BINANCE_API,
    APISECRET: BINANCE_SEC,
  });
  if (side === "ask") {
    binance.marketSell(`${symbol}BTC`, 1, (e, response) => {
      console.info("Market Buy response", response);
      console.info("order id: " + response.orderId);
    });
  } else if (side === "bid") {
    binance.marketBuy(`${symbol}BTC`, 1, (e, response) => {
      console.info("Market Buy response", response);
      console.info("order id: " + response.orderId);
    });
  }
};
const upbitTrade = async (symbol, side, price) => {
  const result = await axios.get(
    `https://api.upbit.com/v1/orderbook?markets=KRW-${symbol}`
  );

  let body = {
    market: `KRW-${symbol}`,
    side,
  };
  if (side === "ask") {
    //sell
    body.price = null;
    body.volume = 1000 / price;
    body.ord_type = "market";
  } else if (side === "bid") {
    //buy
    body.price = 1000;
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
  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    console.log(body);
  });
};
export const upbitBidBinanceAsk = async (req, res, next) => {
  try {
    const {
      body: { symbol, upbitPrice, binancePrice },
    } = req;
    await upbitTrade(symbol, "bid");
    await binanceTrade(symbol, "ask");

    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const binanceBidUpbitAsk = async (req, res, next) => {
  try {
    const {
      body: { symbol, upbitPrice, binancePrice },
    } = req;
    await upbitTrade(symbol, "ask", upbitPrice);
    await binanceTrade(symbol, "bid");
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
