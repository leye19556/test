import express from "express";
import { postCoin, getCoin, checkCoin } from "../controllers/coinController";
import {
  getBinanceNotice,
  postBinanceNotice,
  postUpbitNotice
} from "../controllers/noticeController";

const Router = express.Router();
Router.get("/", getCoin);
Router.post("/", postCoin);
Router.post("/check", checkCoin);
Router.get("/notice", getBinanceNotice);
Router.post("/notice/binance", postBinanceNotice);
Router.post("/notice/upbit", postUpbitNotice);
export default Router;
