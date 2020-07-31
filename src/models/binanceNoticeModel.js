import mongoose from "mongoose";
const binanceNoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "title is required",
  },
  coin: {
    type: String,
    required: "coin is required",
  },
  link: {
    type: String,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: String,
    required: "updatedAt is required",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const binanceNoticeModel = mongoose.model("BinanceNotice", binanceNoticeSchema);
export default binanceNoticeModel;
