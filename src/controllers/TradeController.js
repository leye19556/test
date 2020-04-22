//매수:bid:sell 매도:ask:buy
import ccxt from "ccxt";
import request from "request";
import { v4 } from "uuid";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import queryString from "querystring";

const UPBIT_API = "22bb6xhjM7YndAsQ84TYEOD071DWhyCoxrASRWSR";
const UPBIT_SEC = "sctWwG494PzxglGGs78MxtIWkcmWhO7RtNeoy7le";
const BINANCE_API =
  "9Z02YXaX43ad1JLg1ZkETbpLH3mEhcmQ5BtToNGTFCNbpWPDYEawBwirk6esQsOl";
const BINANCE_SEC =
  "fGSmq5Xux2rnQhxOROcSRqyzZrzyYm25ipZltqrmmm1wfnHRLxWbyJWsAaRCodwe";
const upbitTrade = (symbol, side) => {
  const body = {
    market: `KRW-${symbol}`,
    side,
    volume: null,
    price: 100,
    ord_type: `${side === "bid" ? "price" : "market"}`,
  };
  console.log(body);
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
      body: { symbol },
    } = req;
    await upbitTrade(symbol, "bid");
    /*const upbit = new ccxt.upbit({
      apiKey: UPBIT_API, //upbitApi,
      secret: UPBIT_SEC, //upbitSec,
      enableRateLimit: true,
      //options: {
      //createMarketBuyOrderRequiresPrice: false, // default
      //},
    });
    const binance = new ccxt.binance({
      apiKey: BINANCE_API, //binanceApi,
      secret: BINANCE_SEC, //binanceSec,
      enableRateLimit: true,
      //options: {
      //createMarketBuyOrderRequiresPrice: false, // default
      //},
    });
    await binance.loadMarkets();
    await upbit.loadMarkets();
    binance.verbose = true;
    upbit.verbose = true;
    const type = "market", //or limit
      amount = 0.001; //거래 양
    /*const u = await upbit.createOrder(`${symbol}/KRW`, type, "sell", 500, 10, {
      test: true,
    });
    const b = await binance.createOrder(
      `${symbol}/BTC`,
      type,
      "buy",
      0.001,
      undefined,
      { test: true }
    );
    console.log(b);*/
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const binanceBidUpbitAsk = async (req, res, next) => {
  try {
    const {
      body: { symbol },
    } = req;
    await upbitTrade(symbol, "ask");
    /*const upbit = new ccxt.upbit({
      apiKey: UPBIT_API, //upbitApi,
      secret: UPBIT_SEC, //upbitSec,
      enableRateLimit: true,
      //options: {
      //createMarketBuyOrderRequiresPrice: false, // default
      //},
    });
    const binance = new ccxt.binance({
      apiKey: BINANCE_API, //binanceApi,
      secret: BINANCE_SEC, //binanceSec,
      enableRateLimit: true,
      options: {
        createMarketBuyOrderRequiresPrice: false,
      },
    });
    await binance.loadMarkets();
    await upbit.loadMarkets();
    binance.verbose = true;
    upbit.verbose = true;
    const type = "market";
    const b = await binance.createMarketOrder(
      `${symbol}/BTC`,

      "sell", //bid
      0.1,
      10,
      { test: true }
    );
    const u = await upbit.createOrder(
      `${symbol}/KRW`,
      type,
      "sell", //ask
      500,
      undefined,
      { test: true }
    );
    console.log(b);*/
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
