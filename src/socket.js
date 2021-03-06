import axios from "axios";
import WebSocket from "ws";
import coinModel from "./models/coinModel";
export let coinList = [];
export let tickers1 = {};
export let tickers2 = {};
export let tickers3 = {};
export let upbitBTCKrw = 0;
let binanceBTC = 0;
let thumbBTCKrw = 0;
let wsBinance = null;
let wsUpbit = null;
let wsBithumb = null;
let userList = [];
export let socketConnected = false;
export const getPercent = (x, y) => {
  return ((x - y) / y) * 100;
};
const getCoinList = async () => {
  if (coinList.length === 0)
    coinList = (await coinModel.find())?.map((coin) => coin.name);
  if (coinList.length > 0) {
    upbitWS();
    binanceWS();
    bithumbWS();
  }
};
//업비트 소켓 연결
const upbitWS = async () => {
  if (wsUpbit === null) {
    const upbitList = (
      await axios.get("https://api.upbit.com/v1/market/all")
    ).data.filter(
      (coin) =>
        coin.market.includes("KRW") && coinList.includes(coin.market.slice(4))
    );
    wsUpbit = new WebSocket("wss://api.upbit.com/websocket/v1");
    wsUpbit.binaryType = "arraybuffer";
    wsUpbit.onopen = () => {
      console.log("u connected");
      if (wsUpbit !== null && wsUpbit.readyState === 1) {
        const data = [
          { ticket: "test" },
          {
            type: "ticker",
            codes: ["KRW-BTC", ...upbitList.map((coin) => `${coin.market}`)],
          },
        ];
        wsUpbit.send(JSON.stringify(data));
      }
    };
    wsUpbit.onmessage = (e) => {
      //if (wsUpbit !== null && wsUpbit.readyState === 1) {
      const enc = new TextDecoder("utf-8");
      const arr = new Uint8Array(e.data);
      const { code, trade_price, timestamp } = JSON.parse(enc.decode(arr));
      const symbol = code.slice(code.indexOf("-") + 1, code.length);
      if (symbol === "BTC") upbitBTCKrw = trade_price;
      tickers1[symbol] = trade_price;
    };
    wsUpbit.onclose = () => {
      if (wsUpbit !== null) {
        wsUpbit.close();
        wsUpbit = null;
      }
    };
    wsUpbit.onerror = (e) => {
      console.log(e);
    };
  }
};
//바이낸스 소켓 연결
const binanceWS = async () => {
  if (wsBinance === null) {
    let streams = "";
    for (let i = 0; i < coinList.length; i++) {
      if (i < coinList.length - 1) {
        streams += `${coinList[i].toLowerCase()}btc@ticker/`;
      } else streams += `${coinList[i].toLowerCase()}btc@ticker/`;
    }
    streams += `btcusdt@ticker`;
    wsBinance = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}` //ethbtc@ticker" //"
    );
    wsBinance.onopen = () => {
      if (wsBinance !== null && wsBinance.readyState === 1) {
        console.log("b connected");
      }
    };
    wsBinance.onmessage = (e) => {
      if (wsBinance.readyState === 1) {
        const {
          data: { s, c },
        } = JSON.parse(e.data);
        //console.log(e.data);
        const symbol = s.slice(0, s.length - 3);
        if (symbol === "BTCU") {
          binanceBTC = parseFloat(c);
          tickers2[s.slice(0, s.length - 4)] = parseFloat(c);
        } else {
          tickers2[symbol] = parseFloat(c);
        }
      }
    };
    wsBinance.onclose = () => {
      if (wsBinance !== null) {
        wsBinance.close();
        wsBinance = null;
      }
    };
    wsBinance.onerror = (e) => {
      console.log(e);
    };
  }
};

//빗썸 소켓 연결
const bithumbWS = async () => {
  if (wsBithumb === null) {
    const bithumbList = Object.keys(
      (await axios.get("https://api.bithumb.com/public/orderbook/ALL")).data
        .data
    ).slice(2);
    wsBithumb = new WebSocket(`wss://pubwss.bithumb.com/pub/ws`);
    wsBithumb.onopen = () => {
      if (wsBithumb !== null && wsBithumb.readyState === 1) {
        console.log("t connected");
        const data = {
          type: "ticker",
          symbols: ["BTC_KRW", ...bithumbList.map((coin) => `${coin}_KRW`)],
          tickTypes: ["30M", "1H"],
        };
        wsBithumb.send(JSON.stringify(data));
      }
    };
    wsBithumb.onmessage = (e) => {
      const { data } = e;
      if (data) {
        const info = JSON.parse(data);
        const symbol = info?.content?.symbol.slice(
          0,
          info?.content?.symbol.length - 4
        );
        tickers3[symbol] = parseFloat(info?.content?.closePrice);
        if (symbol === "BTC")
          thumbBTCKrw = parseFloat(info?.content?.closePrice);
      }
    };
    wsBithumb.onclose = () => {
      if (wsBithumb !== null) {
        wsBithumb.close();
        wsBithumb = null;
      }
    };
    wsBithumb.onerror = (e) => {
      console.log(e);
    };
  }
};

const socket = (io) => {
  //io.set("transports", ["websocket"]);
  const connect = io.on("connect", (socket) => {
    //console.log("socket connected");
    socketConnected = true;

    if (userList.indexOf(socket.id) === -1) userList.push(socket.id);
    socket.emit("welcome");
    getCoinList();

    socket.on("send", () => {
      if (coinList.length > 0) {
        let current = ["BTC", ...coinList].map((v) => {
          return {
            symbol: v, //tickers1[`${v}/KRW`].symbol.slice(0, tickers1[v].symbol.indexOf("/")),
            last: tickers1[`${v}`] === undefined ? 0 : tickers1[`${v}`],
            blast: tickers2[`${v}`] === undefined ? 0 : tickers2[`${v}`],
            convertedBlast:
              tickers2[`${v}`] === undefined
                ? 0
                : parseFloat((tickers2[`${v}`] * upbitBTCKrw).toFixed(2), 10),
            thumb: tickers3[`${v}`] === undefined ? 0 : tickers3[`${v}`],
            per1:
              tickers1[`${v}`] === undefined || tickers2[`${v}`] === undefined
                ? undefined
                : getPercent(
                    tickers1[`${v}`],
                    parseFloat((tickers2[`${v}`] * upbitBTCKrw).toFixed(2), 10)
                  ),
            per2:
              tickers3[`${v}`] === undefined || tickers2[`${v}`] === undefined
                ? undefined
                : getPercent(
                    tickers3[`${v}`],
                    parseFloat((tickers2[`${v}`] * upbitBTCKrw).toFixed(2), 10)
                  ),
          };
        });
        socket.emit("receive", current);
      } else {
        socket.emit("failure");
      }
    });
    socket.on("error", (error) => {
      console.log("WebSocket Error:", error);
    });
    socket.on("disconnect", (reason) => {
      socketConnected = false;
      userList = userList.filter((id) => id !== socket.id);
      if (userList.length === 0) {
        if (wsBinance !== null) wsBinance.close();
        if (wsUpbit !== null) wsUpbit.close();
        if (wsBithumb !== null) wsBithumb.close();
      }
      socket.emit("disconnected");
    });
  });
};
export default socket;
