import mongoose from "mongoose";
mongoose.connect("mongodb://localhost/coin_at", {
  useNewUrlParser: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected to mongodb server");
});
