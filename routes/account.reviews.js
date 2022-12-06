const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");
const moment = require("moment");
const DATE_FORMAT = "YYYY/MM/DD";

// リクエストからレビューを取得するメソッド
const createReviewData = function (req) {
  let body = req.body, date;
  return {
    shopId: req.params.shopId,
    score: parseFloat(body.score),
    visit: (date = moment(body.visit, DATE_FORMAT)) && date.isValid() ? date.toDate() : null,
    post: new Date(),
    description: body.description
  };
};

// 投稿画面
router.get("/regist/:shopId(\\d+)", async (req, res, next) => {
  let shopId = req.params.shopId;
  let shop, shopName, review, results;

  try {
    results = await MySQLClient.executeQuery(
      await sql("SELECT_SHOP_BASIC_BY_ID"),
      [shopId]
    );
    // 店舗情報を取り出す
    shop = results[0] || {};
    shopName = shop.name;
    review = {};

    // view呼び出し
    res.render("../views/account/reviews/regist-form.ejs", { shopId, shopName, review });
  } catch (err) {
    next(err);
  }
});

// 投稿確認画面
router.post("/regist/:shopId(\\d+)", (req, res) => {
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;

  res.render("../views/account/reviews/regist-form.ejs", { shopId, shopName, review});
});

// 投稿確認画面
router.post("/regist/confirm", (req, res) => {
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;

  res.render("../views/account/reviews/regist-confirm.ejs", { shopId, shopName, review});
});

module.exports = router;