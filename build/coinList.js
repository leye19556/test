"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCoinList = void 0;
var btcCoinList = ["ADA/BTC", "ADX/BTC", "ARDR/BTC", "ATOM/BTC", "BAT/BTC", "BCH/BTC", "BSV/BTC", "BTS/BTC", "CTXC/BTC", "CVC/BTC", "DCR/BTC", "DOGE/BTC", "ELF/BTC", "ENG/BTC", "EOS/BTC", "ETC/BTC", "ETH/BTC", "GNT/BTC", "GRS/BTC", "KMD/BTC", "LOOM/BTC", "LSK/BTC", "LTC/BTC", "MANA/BTC", "MCO/BTC", "MTL/BTC", "NKN/BTC", "OMG/BTC", "POLY/BTC", "POWR/BTC", "QTUM/BTC", "RCN/BTC", "SNT/BTC", "STEEM/BTC", "STORJ/BTC", "TRX/BTC", "WAVES/BTC", "XEM/BTC", "XLM/BTC", "XRP/BTC", "XZC/BTC", "ZEN/BTC", "ZRX/BTC"];
var krwCoinList = ["ADA/KRW", "ADX/KRW", "AERGO/KRW", "ANKR/KRW", "ARDR/KRW", "ARK/KRW", "ATOM/KRW", "BAT/KRW", "BCH/KRW", "BSV/KRW", "BTC/KRW", "BTG/KRW", "BTT/KRW", "COSM/KRW", "CRE/KRW", "CVC/KRW", "DCR/KRW", "DMT/KRW", "EDR/KRW", "ELF/KRW", "EMC2/KRW", "ENJ/KRW", "EOS/KRW", "ETC/KRW", "ETH/KRW", "GAS/KRW", "GNT/KRW", "GRS/KRW", "GTO/KRW", "HBAR/KRW", "ICX/KRW", "IGNIS/KRW", "IOST/KRW", "IOTA/KRW", "IQ/KRW", "KMD/KRW", "KNC/KRW", "LOOM/KRW", "LSK/KRW", "LTC/KRW", "MANA/KRW", "MBL/KRW", "MCO/KRW", "MED/KRW", "MFT/KRW", "MLK/KRW", "MOC/KRW", "MTL/KRW", "NEO/KRW", "NPXS/KRW", "OMG/KRW", "ONG/KRW", "ONT/KRW", "ORBS/KRW", "OST/KRW", "POLY/KRW", "POWR/KRW", "QKC/KRW", "QTUM/KRW", "REP/KRW", "RFR/KRW", "SBD/KRW", "SC/KRW", "SNT/KRW", "SOLVE/KRW", "SRN/KRW", "STEEM/KRW", "STORJ/KRW", "STORM/KRW", "STPT/KRW", "STRAT/KRW", "TFUEL/KRW", "THETA/KRW", "TRX/KRW", "TSHP/KRW", "TT/KRW", "TTC/KRW", "UPP/KRW", "VET/KRW", "VTC/KRW", "WAVES/KRW", "WAXP/KRW", "XEM/KRW", "XLM/KRW", "XRP/KRW", "ZIL/KRW", "ZRX/KRW"];

var getCoinList = function getCoinList() {
  var btcList = btcCoinList.map(function (v) {
    return v.slice(0, v.indexOf("/"));
  });
  var krwList = krwCoinList.map(function (v) {
    return v.slice(0, v.indexOf("/"));
  });
  var coinList = krwList.filter(function (v) {
    return btcList.includes(v);
  });
  return {
    btc: coinList.map(function (v) {
      return "".concat(v, "/BTC");
    }),
    krw: coinList.map(function (v) {
      return "".concat(v, "/KRW");
    })
  };
};

exports.getCoinList = getCoinList;