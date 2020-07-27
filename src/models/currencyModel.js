import mongoose from "mongoose";
const currencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "name is required",
    },
    value: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);
const currencyModel = mongoose.model("Currency", currencySchema);
export default currencyModel;
