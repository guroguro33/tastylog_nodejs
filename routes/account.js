const router = require("express").Router();
const {authenticate, authorize, PRIVILEGE} = require("../lib/security/accesscontrol.js");

router.get("/login", (req, res) => {
  // ログインエラー用にflashを渡しておく
  res.render("./account/login.ejs", {message: req.flash("message")});
});

router.post("/login", authenticate());

router.use("/reviews", require("./account.reviews.js"));

module.exports = router;