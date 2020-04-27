import coinModel from "../models/coinModel";
import axios from "axios";
const apikey_btc = "93ff249f-e05e-4a4a-9584-ee373ffba6c9";
export const getAdmin = async (req, res, next) => {
  try {
    const coins = await coinModel.find();
    res.render("admin", { coins });
  } catch (e) {}
};
