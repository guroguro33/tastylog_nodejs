const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");

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

module.exports = router;