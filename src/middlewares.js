import moment from "moment";
import ccxt from "ccxt";
export const getCoinNames = async (type = 0) => {
  const binance = new ccxt.binance(),
    huobi = new ccxt.huobipro(),
    upbit = new ccxt.upbit();
  await Promise.all([
    binance.loadMarkets(),
    huobi.loadMarkets(),
    upbit.loadMarkets()
  ]);
  const binance_symbols = await binance.symbols;
  const upbit_symbols = await upbit.symbols;
  const huobi_symbols = await huobi.symbols;
  const bcoinList = binance_symbols.filter(v => v.includes("/BTC"));
  const ucoinList = upbit_symbols.filter(v => v.includes("/BTC"));
  const hcoinList = huobi_symbols.filter(v => v.includes("/BTC"));
  //console.log(bcoinList.length, ucoinList.length, hcoinList.length);
  if (type === 1) {
    const coinList = ucoinList
      .filter(v => bcoinList.includes(v))
      .filter(v => hcoinList.includes(v))
      .map(v => v.slice(0, v.indexOf("/")));
    return coinList;
  }
  const coinList = ucoinList
    .filter(v => bcoinList.includes(v))
    .filter(v => hcoinList.includes(v));
  return coinList;
};
export const localMiddleware = async (req, res, next) => {
  res.locals.pageTitle = "CoinAT";
  res.locals.moment = moment;
  res.locals.coins = await getCoinNames(1);
  next();
};
