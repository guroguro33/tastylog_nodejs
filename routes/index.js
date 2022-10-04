const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("./index.ejs"); // viewsフォルダからの相対パス
});

module.exports = router;