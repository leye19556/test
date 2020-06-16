import coinModel from "../models/coinModel";
export const getAdmin = async (req, res, next) => {
  try {
    const coins = await coinModel.find();
    res.render("admin", { coins });
  } catch (e) {}
};
