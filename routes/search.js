const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");
const MAX_ITEMS = 5;

router.get("/", async (req, res, next) => { // クエリパラメータ取得の場合は/だけでOK
  let keyword = req.query.keyword || "";
  let results;

  try {
    if (keyword) {
      results = await MySQLClient.executeQuery(
        await sql("SELECT_SHOP_LIST_BY_NAME"),
        [
          `%${keyword}%`,
          MAX_ITEMS
        ]
      );
    } else {
      results = await MySQLClient.executeQuery(
        await sql("SELECT_SHOP_HIGH_SCORE_LIST"),[MAX_ITEMS]
      );
    }
    
    res.render("./search/list.ejs", { results }); // なぜオブジェクト？
  } catch (err) {
    next(err);
  }
  
});

module.exports = router;