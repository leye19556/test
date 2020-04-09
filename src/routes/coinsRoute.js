import express from "express";
import { getCoins } from "../controllers/coinsController";

const Router = express.Router();
Router.get("/", getCoins);

export default Router;
