import mongoose from "mongoose";
const binanceCoinSchema = new mongoose.Schema(
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
const binanceCoinModel = mongoose.model("BinanceCoin", binanceCoinSchema);
export default binanceCoinModel;
