import axios from "axios";
import moment from "moment";
const infoWrapper = document.querySelector(".info-wrapper"),
  infoContainer = document.querySelector(".info-container"),
  fa = document.querySelector(".fa-minus");
let watchingPer = -1;
export const setWatchPer = v => {
  watchingPer = v;
};
const requestNewCoinUpdateInfo = () => {
  return axios.get(
    "https://api-manager.upbit.com/api/v1/notices/search?search=%5B%EA%B1%B0%EB%9E%98%5D&page=1&per_page=20&before=&target=non_ios&thread_name=general"
  );
};
const sendPostCoinRequest = coins => {
  return axios.post("http://localhost:8989/coin", { coins });
};
const coinCheckRequest = (coins, x) => {
  return axios.post("http://localhost:8989/coin/check", { coins, x });
};
const postCoin = async (coins, x) => {
  const { status, data } = await sendPostCoinRequest(coins);
  if (status === 200 && data.length === 0) {
    coinCheckRequest(coins, x);
  }
};
const getNewCoinUpdateInfo = async () => {
  const result = await requestNewCoinUpdateInfo();
  const coins = [];
  infoContainer.textContent = "";
  [].forEach.call(filteringDate(result.data), v => {
    const p = document.createElement("p");
    const idx1 = v.title.search(/[(]/),
      idx2 = v.title.search(/[)]/);
    const coinSymbol = v.title.slice(idx1, idx2).split(" ")[1]; //coin symbol 값
    coins.push(coinSymbol);
    p.innerText = `${v.title}`;
    p.className = `info ${v.id}`;
    infoContainer.appendChild(p);
  });

  if (coins.length > 0 && watchingPer !== -1) postCoin(coins, watchingPer);
};
const filteringDate = payload => {
  const { data } = payload;
  const todaysInfo = data?.list?.filter(
    v =>
      moment(v.created_at).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
  );
  return todaysInfo;
};
const onToggleMinimize = e => {
  const { target } = e;
  if (target.classList.contains("fa-minus")) {
    target.className = "fa fa-plus";
  } else {
    target.className = "fa fa-minus";
  }
  infoWrapper.classList.toggle("close");
};

const init = () => {
  setInterval(getNewCoinUpdateInfo, 2500);
  fa.addEventListener("click", onToggleMinimize);
};
init();
