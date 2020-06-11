import express from "express";
import {
  getBinanceNotice,
  postBinanceNotice,
  getUpbitNotice,
} from "../controllers/noticeController";
import {
  postCoin,
  deleteCoin,
  getCoins,
  getCurrency,
  editCoin,
} from "../controllers/coinController";

const Router = express.Router();
Router.get("/", getCoins);
Router.post("/", postCoin);
Router.delete("/", deleteCoin);
Router.put("/", editCoin);
Router.get("/notice/upbit", getUpbitNotice);
Router.get("/notice/binance", getBinanceNotice);
Router.post("/notice/binance", postBinanceNotice);
Router.get("/currency", getCurrency);
export default Router;
