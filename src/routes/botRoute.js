import express from "express";
import { postMessage, postCancelMessage } from "../controllers/botController";
const app = express.Router();
app.post("/", postMessage);
app.post("/cancel", postCancelMessage);
export default app;
