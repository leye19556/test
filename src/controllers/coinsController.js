import coinModel from "../models/coinModel";

export const getCoins = async (req, res, next) => {
  try {
    const coin = await coinModel.find();
    res.json(coin);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

/***
 * 가격 조회 관련 수정 예정
 */
export const getPrices = async (req, res, next) => {
  const UPBIT = "https://api.upbit.com/v1/ticker?markets=";
  const BINANCE =
    "https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products";
};
