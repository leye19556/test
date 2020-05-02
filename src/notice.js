import axios from "axios";
import { sendMessage } from "./controllers/botController";
import upbitNoticeModel from "./models/upbitNoticeModel";
let timer = null;
const upbitListing = async () => {
  const {
    data: { data },
  } = await axios.get(
    "https://api-manager.upbit.com/api/v1/notices/search?search=%5B%EA%B1%B0%EB%9E%98%5D&page=1&per_page=20&before=&target=non_ios&thread_name=general"
  );
  const notices = data.list;
  for (let i = 0; i < notices.length; i++) {
    const symbol = notices[i].title.slice(
      notices[i].title.lastIndexOf(" ") + 1,
      notices[i].title.length - 1
    );
    const notice = await upbitNoticeModel.findOne({
      coin: symbol,
    });
    if (!notice) {
      await upbitNoticeModel.create({
        title: notices[i].title,
        coin: symbol,
        updatedAt: notices[i].updated_at,
        createdAt: notices[i].created_at,
        checked: true,
      });
      sendMessage(`업비트 업데이트: ${notices[i].title}`, true);
    }
  }
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(upbitListing, 2000);
};
timer = setTimeout(upbitListing, 2000);
