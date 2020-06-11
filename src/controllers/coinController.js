import coinModel from "../models/coinModel";
import axios from "axios";
export const getCoins = async (req, res, next) => {
  try {
    const coins = await coinModel.find().sort({ name: 1 });
    //console.log(coins);
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
      //console.log(name.trim());
      //res.redirect("/admin");
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
    const { data } = await axios.get(
      "https://www.freeforexapi.com/api/live?pairs=USDKRW"
    );
    res.json(data);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
