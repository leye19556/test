import moment from "moment";
import "@babel/polyfill";
export const localMiddleware = async (req, res, next) => {
  res.locals.pageTitle = "CoinAT";
  res.locals.moment = moment;
  next();
};
