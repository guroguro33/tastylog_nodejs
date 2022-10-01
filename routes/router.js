const express = require("express");

// 別ファイルでルーティングをまとめる
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

module.exports = router;
