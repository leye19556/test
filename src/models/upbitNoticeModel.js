import mongoose from "mongoose";
const upbitNoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "title is required"
  },
  coin: {
    type: String,
    required: "coin is required"
  },
  link: {
    type: String,
    default: null
  },
  updatedAt: {
    type: String,
    required: "updatedAt is required"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
const upbitNoticeModel = mongoose.model("UpbitNotice", upbitNoticeSchema);
export default upbitNoticeModel;
