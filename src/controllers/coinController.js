import coinModel from "../models/coinModel";
import Binance from "node-binance-api";
import axios from "axios";
import { sendWalletNotice } from "./walletBotController";
const getUpbitTickers = coins => {
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
const binanceBid = async coin => {
  sendWalletNotice(`${coin} 매수`);
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
};

export const checkCoin = async (req, res, next) => {
  try {
    const {
      body: { coins, x }
    } = req;
    const binance = new Binance().options({
      test: true
    });
    const { data } = await getUpbitTickers(coins);
    const upbit_tickers = {};
    [].forEach.call(data, v => {
      const name = v.market.split("-");
      upbit_tickers[`${name[1]}${name[0]}`] = v;
    });
    const tickers = await binance.prices();
    [].forEach.call(coins, async coin => {
      const c = await coinModel.findOne({ name: coin.toUpperCase() });
      if (c && !c.checked) {
        const ticker1 = tickers[`${coin.toUpperCase()}BTC`];
        const ticker2 = upbit_tickers[`${coin.toUpperCase()}BTC`];
        const diff = (
          ((ticker1 - ticker2.trade_price) / ticker1) *
          100
        ).toFixed(2);
        console.log(ticker1, ticker2.trade_price, diff); //% 차이 계산
        if (diff > 0 && Math.abs(diff) < x) {
          console.log(`바이낸스: ${coin} 매수`);
          /*await coinModel.findOneAndUpdate(
            { name: coin.toUpperCase() },
            {
              checked: true
            }
          );*/
          binanceBid(coin.toUpperCase());
          //국내 상장 코인 해외 거래소에서 차이값 체크, x%이내시 시장가 매수 하도록 설정
          //x% 이상일 경우 계속 주시
          //나중에 수정 가능,
        }
      }
    });
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
