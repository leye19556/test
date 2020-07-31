import mongoose from "mongoose";
const upbitCoinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "name is required",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);
const upbitCoinModel = mongoose.model("upbitCoin", upbitCoinSchema);
export default upbitCoinModel;
