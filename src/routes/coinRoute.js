import express from "express";
import {
  postCoin,
  deleteCoin,
  getCoins,
  editCoin,
  getTickers,
} from "../controllers/coinController";

const Router = express.Router();
Router.get("/", getCoins);
Router.post("/", postCoin);
Router.delete("/", deleteCoin);
Router.put("/", editCoin);
Router.get("/tickers", getTickers);

export default Router;
