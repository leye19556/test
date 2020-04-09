import express from "express";
import { postCoin, getCoin, checkCoin } from "../controllers/coinController";

const Router = express.Router();
Router.get("/", getCoin);
Router.post("/", postCoin);
Router.post("/check", checkCoin);
export default Router;
