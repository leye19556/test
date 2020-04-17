import coinModel from "../models/coinModel";

export const postCoin = async (req, res, next) => {
  try {
    const {
      body: { name },
    } = req;
    const coin = await coinModel.findOne({
      name,
    });
    if (coin)
      res.status(404).json({ success: 0, msg: "코인이 이미 존재합니다" });
    await coinModel.create({
      name,
    });
    res.redirect("/admin");
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const deleteCoin = async (req, res, next) => {
  try {
    const {
      body: { name },
    } = req;
    console.log(name);
    const coin = await coinModel.findOne({
      name,
    });
    if (!coin)
      res
        .status(404)
        .json({ error: 1, msg: "코인이름이 db에 존재하지 않습니다" });
    await coinModel.deleteOne({
      name,
    });
    res.status(200).json({ error: 0, msg: "삭제 완료" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const checkCoin = async (req, res, next) => {
  try {
    const {
      body: { coins },
    } = req;
    res.end();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
