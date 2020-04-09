import mongoose from "mongoose";
const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "name is required"
  },
  checked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
const coinModel = mongoose.model("Coin", coinSchema);
export default coinModel;
