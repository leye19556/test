import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
//import socketIO from "socket.io";
//import socket from "./socket";
import "./db";
//import { localMiddleware } from "./middlewares";
import globalRoute from "./routes/globalRoute";
import coinRoute from "./routes/coinRoute";
import coinsRoute from "./routes/coinsRoute";
import botRoute from "./routes/botRoute";
dotenv.config();
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(localMiddleware);

app.use("/", globalRoute);
app.use("/coin", coinRoute);
app.use("/coins", coinsRoute);
app.use("/bot", botRoute);
app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ express is running on port:${process.env.PORT || 3000}`);
});
//const io = socketIO(server);
//socket(io);