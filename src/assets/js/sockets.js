import { handleCoinInfo, handleDisconnect } from "./coinInfo";
import { handleSetting } from "./settingbar";
let socket = null;
export const getSocket = () => {
  return socket;
};
export const initSockets = socket => {
  socket.on("updateInfo", handleCoinInfo);
  socket.on("settingAlarm", handleSetting);
  socket.on("disconnect", handleDisconnect);
};
const init = () => {
  socket = io.connect("/");
  initSockets(socket);
};
init();
