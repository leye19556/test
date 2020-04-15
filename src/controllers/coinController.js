import coinModel from "../models/coinModel";
//import Binance from "node-binance-api";
import axios from "axios";
/*const getUpbitTickers = coins => {
  let symbols = "";
  for (let i = 0; i < coins.length; i++) {
    if (i < coins.length - 1) {
      symbols += `BTC-${coins[i].toUpperCase()},`;
    } else {
      symbols += `BTC-${coins[i].toUpperCase()}`;
    }
  }
  return axios.get(`https://api.upbit.com/v1/ticker?markets=${symbols}`);
};

export const getCoin = async (req, res, next) => {
  try {
    const {
      query: { id }
    } = req;
    const coin = await coinModel.findById(id);
    res.json(coin);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const postCoin = async (req, res, next) => {
  try {
    const {
      body: { coins }
    } = req;
    const newCoins = [];
    [].forEach.call(coins, async name => {
      if (name !== null && name !== undefined) {
        const coin = await coinModel.findOne({
          name
        });
        if (!coin) {
          await coinModel.create({ name });
          newCoins.push(name);
        }
      }
    });
    res.json(newCoins);
  } catch (e) {
    next(e);
  }
};*/

export const checkCoin = async (req, res, next) => {
  try {
    const {
      body: { coins }
    } = req;
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
