import express from "express";
import {
  binanceBidUpbitAsk,
  upbitBidBinanceAsk,
} from "../controllers/TradeController";

const app = express();
app.post("/ask", binanceBidUpbitAsk); //ask:buy
app.post("/bid", upbitBidBinanceAsk); //bid:sell

export default app;
