import express from "express";
import { postMessage } from "../controllers/botController";

const app = express.Router();
app.post("/", postMessage);

export default app;
