import axios from "axios";
import moment from "moment";
const infoWrapper = document.querySelector(".binance-notice");
const infoContainer = infoWrapper.querySelector(".info-container"),
  fa = infoWrapper.querySelector(".fa-minus");
const requestNewCoinUpdateInfo = () => {
  return axios.get(`http://localhost:8989/coin/notice`);
};
const getNewCoinUpdateInfo = async () => {
  const result = await requestNewCoinUpdateInfo();
  infoContainer.innerHTML = "";
  [].forEach.call(result.data, v => {
    const a = document.createElement("a");
    a.innerText = v.title;
    a.href = v.link;
    a.target = "_blank";
    a.className = `info ${v._id}`;
    infoContainer.appendChild(a);
  });
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
  setInterval(getNewCoinUpdateInfo, 3000);
  fa.addEventListener("click", onToggleMinimize);
};
init();
