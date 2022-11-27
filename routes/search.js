const router = require("express").Router();
const { MySQLClient, sql } = require("../lib/database/client.js");

router.get("/", async (req, res, next) => { // クエリパラメータ取得の場合は/だけでOK
  let keyword = req.query.keyword || "";
  let result;
  
});

module.exports = router;