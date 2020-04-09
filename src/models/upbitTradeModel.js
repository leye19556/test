import mongoose from "mongoose";
const upbitTradeSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: "coin is required"
  },
  amount: {
    type: Number,
    default: 0
  },

  tradedone: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
const upbitTradeModel = mongoose.model("Upbit", upbitTradeSchema);
export default upbitTradeModel;
