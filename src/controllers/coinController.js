import coinModel from "../models/coinModel";
import axios from "axios";

export const getTickers = async (req, res, next) => {
  try {
    res.json([]);
  } catch (e) {
    next(e);
  }
};

export const getCoins = async (req, res, next) => {
  try {
    const coins = await coinModel.find().sort({ name: 1 });
    res.json(coins);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const postCoin = async (req, res, next) => {
  try {
    const {
      body: { name },
    } = req;
    const coinName = name.toUpperCase();
    const coin = await coinModel.findOne({
      name: coinName,
    });
    if (coin) {
      return res
        .status(404)
        .json({ success: 0, msg: "코인이 이미 존재합니다" });
    }
    await coinModel.create({
      name: coinName,
    });
    res.redirect("/admin");
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const deleteCoin = async (req, res, next) => {
  try {
    const {
      body: { name },
    } = req;
    const coin = await coinModel.findOneAndDelete({
      name: name.trim(),
    });
    console.log(coin);
    if (!coin) {
      res
        .status(404)
        .json({ error: 1, msg: "코인이름이 db에 존재하지 않습니다" });
    } else {
      res.status(200).json({ error: 0, msg: "삭제 완료" });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const editCoin = async (req, res, next) => {
  try {
    const {
      body: { id, name },
    } = req;
    await coinModel.findByIdAndUpdate(id, { name });
    res.status(200).json();
  } catch (e) {
    next(e);
  }
};

export const checkCoin = async (req, res, next) => {
  try {
    const {
      body: { coins },
    } = req;
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getCurrency = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://www.binance.com/exchange-api/v1/public/asset-service/product/currency"
    );
    if (response.status === 200) {
      res.json(response.data);
    }
    res.json([]);
  } catch (e) {
    console.log(e);
    res.json([]);
  }
};
