import { getSocket } from "./sockets";
const coinContainer = document.querySelector(".coin-info-container"),
  baseRate = document.querySelector(".upbit-btc-krw"),
  usdkrw = document.querySelector(".usd_krw"),
  binanceBtcUsd = document.querySelector(".binance-btc-usd"),
  btcDiff = document.querySelector(".btc-diff");
// 상단 비트코인 값 태그

const baseSelector = document.querySelector(".base-selector"),
  coinSelector = document.querySelector(".coin-selector"),
  alarmInput = document.querySelector(".alarm-percent-input"),
  coinSettingBtn = document.querySelector(".coin-setting-btn"),
  coinSettingCancel = document.querySelector(".coin-setting-cancel");
let timer = null;
let base = "upbit",
  coin = "All",
  percent = -1;
const SECONDS = 3200;
export const checkColor = (tag, v) => {
  if (v > 0) {
    tag.style.color = "green";
  } else if (v < 0) {
    tag.style.color = "red";
  } else {
    tag.style.color = "black";
  }
};
export const exchangeCurreny = (x, y) => x * y;
export const handleCoinInfo = data => {
  if (coinContainer) {
    const binanceBtc = exchangeCurreny(
      data["upbit"]?.btc_usd,
      data["upbit"]?.usd_krw
    ).toFixed(0);
    usdkrw.innerText = `1$: ${data["upbit"].usd_krw}₩`;
    baseRate.innerText = `업비트 기준 BTC/KRW: ${data["upbit"]?.btc_krw}₩`; //BTC/KRW
    binanceBtcUsd.innerText = `바이낸스 기준 BTC/KRW: ${binanceBtc}₩`;
    btcDiff.innerText = `${(
      ((data["upbit"]?.btc_krw - binanceBtc) / data["upbit"]?.btc_krw) *
      100
    ).toFixed(2)}%`;
    for (const i in data) {
      for (let idx = 0; idx < data[i].upbit_data.length; idx++) {
        const coinName = data[i].upbit_data[idx][0].slice(
          0,
          data[i].upbit_data[idx][0].indexOf("/")
        );
        const coinClass = document.querySelector(`.${coinName}`);
        const upbit_krw = data[i]?.upbit_data[idx][1]?.last,
          binance_krw =
            data[i]?.binance_data[idx][1]?.last * data["upbit"]?.btc_krw;
        const per = (((upbit_krw - binance_krw) / upbit_krw) * 100).toFixed(2);
        if (coinClass) {
          const currentCoin = coinClass.querySelector(`.coin-${coinName}`),
            percentagWithBinance = coinClass.querySelector(
              `.percentage-binance-${coinName}`
            ),
            //upbitToKrw = coinClass.querySelector(`.krw-upbit-${coinName}`),
            binanceToKrw = coinClass.querySelector(`.krw-binance-${coinName}`),
            upbitToBtc = coinClass.querySelector(`.btc-upbit-${coinName}`),
            binanceToBtc = coinClass.querySelector(`.btc-binance-${coinName}`);
          currentCoin.innerText = data[i].upbit_data[idx][0].slice(
            0,
            data[i].upbit_data[idx][0].indexOf("/")
          );
          //if (upbitToKrw) upbitToKrw.innerText = `\n${upbit_krw.toFixed(2)} 원`;
          if (binanceToKrw)
            binanceToKrw.innerText = `\n${binance_krw.toFixed(2)} 원`;
          upbitToBtc.innerText = `${data[i].upbit_data[idx][1]?.last} 원`;
          binanceToBtc.innerText = `${data[i].binance_data[idx][1]?.last}`;
          percentagWithBinance.innerText = `${per}%`;
        } else {
          const li = document.createElement("li"),
            exchange = document.createElement("p"),
            currentCoin = document.createElement("p"),
            currentPrice = document.createElement("p"),
            priceWithBinance = document.createElement("p"),
            percentagWithBinance = document.createElement("p"),
            upbitToBtc = document.createElement("p"),
            binanceToBtc = document.createElement("p"),
            upbitToKrw = document.createElement("p"),
            binanceToKrw = document.createElement("p");

          li.className = `coin ${coinName}`;
          currentCoin.className = `coin-${coinName}`;
          //exchange.className = `exchange-${coinName}`;
          currentPrice.className = `current-${coinName}`;
          priceWithBinance.className = `price-binance-${coinName}`;
          percentagWithBinance.className = `percentage-binance-${coinName}`;

          upbitToBtc.className = `btc-upbit-${coinName} btc`;
          binanceToBtc.className = `btc-binance-${coinName} btc`;
          upbitToKrw.className = `krw-upbit-${coinName} krw`;
          binanceToKrw.className = `krw-binance-${coinName} krw`;

          currentCoin.innerText = coinName;
          exchange.innerText = `${i.charAt(0).toUpperCase() + i.slice(1)}`;
          upbitToBtc.innerText = `${data[i]?.upbit_data[idx][1]?.last} 원`;
          //binanceToBtc.innerText = `${data[i].binance_data[idx][1]?.last}`;
          upbitToKrw.innerText = `\n${upbit_krw.toFixed(2)} 원`;
          binanceToKrw.innerText = `\n${binance_krw.toFixed(2)} 원`;

          percentagWithBinance.innerText = `${per}%`;
          currentPrice.appendChild(upbitToBtc);
          //currentPrice.appendChild(upbitToKrw);
          priceWithBinance.appendChild(binanceToBtc);
          priceWithBinance.appendChild(binanceToKrw);

          li.appendChild(currentCoin);
          li.appendChild(currentPrice);
          li.appendChild(priceWithBinance);
          li.appendChild(percentagWithBinance);
          coinContainer.appendChild(li);
        }
      }
    }
  }
};
export const handleDisconnect = () => {
  console.log("disconnected");
};
export const selectBase = e => {
  const { target } = e;
  base = target.value;
  if (timer) clearInterval(timer);
  timer = setInterval(getCoinInfo, SECONDS);
};
export const selectCoin = e => {
  const { target } = e;
  coin = target.value;
  //console.log(coin);
};
const onCoinSetting = () => {
  const socket = getSocket();
  if (percent > 100 || percent < 0) alert("0~100 사이의 값을 입력하세요");
  else if (coin === "ALL") alert("알림 받을 코인을 설정하세요");
  else if (coin !== "ALL" && percent > 0 && percent <= 100) {
    if (timer) clearInterval(timer);
    timer = setInterval(getCoinInfo, SECONDS);
    socket.emit("settingAlarm", { started: true, coin, percent });
  }
};
const onCoinSettingCancel = () => {
  const socket = getSocket();
  socket.emit("settingAlarm", { started: false, coin, percent });
};
const onAlarmInput = e => {
  percent = e.target.value;
};
const getCoinInfo = () => {
  const socket = getSocket();
  if (socket) {
    socket.emit("updateInfo", { base, symbol: coin.toUpperCase(), percent });
  }
};
const init = () => {
  if (timer === null) timer = setInterval(getCoinInfo, SECONDS);
  if (baseSelector) baseSelector.addEventListener("change", selectBase);
  if (coinSelector) coinSelector.addEventListener("change", selectCoin);
  if (coinSettingBtn) coinSettingBtn.addEventListener("click", onCoinSetting);
  if (coinSettingCancel)
    coinSettingCancel.addEventListener("click", onCoinSettingCancel);
  if (alarmInput) alarmInput.addEventListener("change", onAlarmInput);
};
init();
