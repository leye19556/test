import express from "express";

const Router = express.Router();
Router.get("/", (req, res, next) => {
  //res.render("home");
  res.send("CoinAT api");
});
export default Router;
