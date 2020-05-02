import express from "express";
import {
  getBinanceNotice,
  postBinanceNotice,
  getUpbitNotice,
} from "../controllers/noticeController";
import { postCoin, deleteCoin, getCoins } from "../controllers/coinController";

const Router = express.Router();
Router.get("/", getCoins);
Router.post("/", postCoin);
Router.delete("/", deleteCoin);
Router.get("/notice/upbit", getUpbitNotice);
Router.get("/notice/binance", getBinanceNotice);
Router.post("/notice/binance", postBinanceNotice);
export default Router;
