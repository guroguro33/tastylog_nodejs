const express = require("express");

// 別ファイルでルーティングをまとめる
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(req.query.keyword);
});

module.exports = router;
