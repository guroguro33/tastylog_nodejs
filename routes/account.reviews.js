const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");
const moment = require("moment");
const DATE_FORMAT = "YYYY/MM/DD";

// バリデーションチェック（日付）
const validateReviewData = function (req) {
  const body = req.body;
  let isValid = true, error = {};

  if (body.visit && !moment(body.visit, DATE_FORMAT).isValid()) {
    isValid = false;
    error.visit = "訪問日の日付文字列が不正です。";
  }

  if (isValid) {
    return undefined;
  }
  return error;
};

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
  const error = validateReviewData(req);
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;

  if (error) {
    res.render("../views/account/reviews/regist-form.ejs", {error, shopId, shopName, review});
    return;
  }

  res.render("../views/account/reviews/regist-confirm.ejs", { shopId, shopName, review});
});

router.post("/regis/execute", async (req, res, next) => {
  const error = validateReviewData(req);
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;
  const userId = 1; // TODO：ログイン機能実装後に更新
  let transaction;

  if (error) {
    res.render("../views/account/reviews/regist-form.ejs", { error, shopId, shopName, review });
    return;
  }

  try {
    transaction = await MySQLClient.beginTransaction();
    // SQL処理
    // 悲観ロック
    transaction.executeQuery(
      await sql("SELECT_SHOP_BY_ID_FOR_UPDATE"),
      [shopId]
    );
    transaction.executeQuery(
      await sql("INSERT_SHOP_REVIEW"),
      [shopId, userId, review.score, review.visit, review.description]
    );
    transaction.executeQuery(
      await sql("UPDATE_SHOP_SCORE_BY_ID"),
      [shopId, shopId]
    );
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    next(err);
    return;
  }

  res.render("../views/account/reviews/regist-complete.ejs");
});

module.exports = router;