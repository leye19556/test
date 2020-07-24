import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const u = process.env.PRODUCTION ? process.env.HEROKU_DB : process.env.LOCAL_DB;
//process.env.PROD_MONGO_DB

mongoose.connect(
  process.env.PRODUCTION ? process.env.HEROKU_DB : process.env.LOCAL_DB,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);
const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log(`Connected to mongodb server ${u}`);
});
