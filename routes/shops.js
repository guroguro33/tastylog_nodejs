const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");

router.get("/:id", async (req, res, next) => {
  let id = req.params.id;

  Promise.all([
    MySQLClient.executeQuery(
      await sql("SELECT_SHOP_DETAIL_BY_ID"), [id]
    ),
    MySQLClient.executeQuery(
      await sql("SELECT_SHOP_REVIEW_BY_SHOP_ID"), [id]
    )
  ]).then ((result) => {
    let data = result[0][0];
    data.reviews = result[1] || [];
    res.render("../views/shops/index.ejs", data);
  }).catch ((err) => {
    next(err);
  });
});

module.exports = router;