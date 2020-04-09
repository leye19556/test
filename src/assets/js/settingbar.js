import { setWatchPer } from "./newCoinListing";

const settingBtn = document.querySelector(".setting-btn"),
  settingBar = document.querySelector(".setting-bar"),
  percentageInput = document.querySelector(".percentage-input"),
  percentageBtn = document.querySelector(".percentage-btn"),
  percentageCancel = document.querySelector(".percentage-cancel"),
  upbitApi = document.querySelector(".upbit-api"),
  upbitSecret = document.querySelector(".upbit-secret"),
  upbitBtn = document.querySelector(".upbit-btn"),
  binanceApi = document.querySelector(".binance-api"),
  binanceSecret = document.querySelector(".binance-secret"),
  binanceBtn = document.querySelector(".binance-btn"),
  cleanAllBtn = document.querySelector(".clear-all-btn");

const toggleSettingBar = () => {
  settingBar.classList.toggle("hide");
};
const onSettingBtn = () => {
  const val = percentageInput.value;
  setWatchPer(val);
  alert(`[상장코인] ${val}% 이하 시 시장가 매수 설정 완료`);
};
const cleanInputs = tags => {
  [].forEach.call(tags, tag => {
    tag.value = "";
  });
};
const onSettingUpbit = () => {
  if (upbitBtn.innerHTML.trim() === "등록") {
    console.log("asd");
    const api = upbitApi.value;
    const secret = upbitSecret.value;
    if (api === "" || secret === "") {
      alert("Upbit: API, SECRET 값을 입력해주세요");
    } else {
      console.log(api, secret);
      upbitBtn.innerHTML = "취소";
    }
  } else if (upbitBtn.innerHTML.trim() === "취소") {
    cleanInputs([upbitApi, upbitSecret]);
    upbitBtn.innerHTML = "등록";
  }
};
const onSettingBinance = () => {
  if (binanceBtn.innerHTML.trim() === "등록") {
    const api = binanceApi.value;
    const secret = binanceSecret.value;
    if (api === "" || secret === "") {
      alert("Binance: API, SECRET 값을 입력해주세요");
    } else {
      console.log(api, secret);
      binanceBtn.innerHTML = "취소";
    }
  } else {
    cleanInputs([binanceApi, binanceSecret]);
    binanceBtn.innerHTML = "등록";
  }
};
const onCleanAll = () => {
  //입력된 모든 key 제거
};
const onCancel = () => {
  setWatchPer(-1);
  alert(`[상장코인] ${val}% 이하 시 시장가 매수 설정 완료`);
};
export const handleSetting = ({ started }) => {
  if (started) alert(`알림 설정 성공`);
  else alert(`알림 취소 성공`);
};
const init = () => {
  if (settingBtn) settingBtn.addEventListener("click", toggleSettingBar);
  if (percentageBtn) percentageBtn.addEventListener("click", onSettingBtn);
  if (percentageCancel) percentageCancel.addEventListener("click", onCancel);
  if (upbitBtn) upbitBtn.addEventListener("click", onSettingUpbit);
  if (binanceBtn) binanceBtn.addEventListener("click", onSettingBinance);
  if (cleanAllBtn) cleanAllBtn.addEventListener("click", onCleanAll);
};
init();
