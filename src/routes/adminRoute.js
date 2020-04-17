import express from "express";
import { getAdmin } from "../controllers/adminController";

const app = express.Router();
app.get("/", getAdmin);
export default app;
