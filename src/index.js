import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import socketIO from "socket.io";
import { localMiddleware } from "./middlewares";
import globalRoute from "./routes/globalRoute";
import coinRoute from "./routes/coinRoute";
import botRoute from "./routes/botRoute";
import adminRoute from "./routes/adminRoute";
import tradeRoute from "./routes/tradeRoute";
import "./db";
import "./noticeUpbit";
import "./noticeBinance";
import "./noticeCoinGap";
import socketEvent from "./socket";
import "@babel/polyfill";
dotenv.config();
const app = express();

app.use(helmet());
//app.use(morgan(process.env.PRODUCTION ? "common" : "dev"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(localMiddleware);
app.use(
  cors({
    origin: ["http://localhost:3000", "https://leye195.github.io"],
    credentials: true,
  })
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/", globalRoute);
app.use("/coin", coinRoute);
app.use("/bot", botRoute);
app.use("/trade", tradeRoute);
app.use("/admin", adminRoute);
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ express is running on port:${process.env.PORT || 3000}`);
});

const socket = socketIO(server);
socketEvent(socket);
