import express from "express";
import {
  binanceBidUpbitAsk,
  upbitBidBinanceAsk,
  postUpbitKey,
  postBinanceKey,
} from "../controllers/TradeController";

const app = express();
app.post("/ask", binanceBidUpbitAsk); //ask:buy
app.post("/bid", upbitBidBinanceAsk); //bid:sell
app.post("/upbit_key", postUpbitKey);
app.post("/binance_key", postBinanceKey);
export default app;
