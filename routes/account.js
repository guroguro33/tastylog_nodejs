const router = require("express").Router();
const {authenticate, authorize, PRIVILEGE} = require("../lib/security/accesscontrol.js");

// 会員画面（認可を入れる場合、第２引数にauthorizeメソッドを呼ぶ）
router.get("/", authorize(PRIVILEGE.NORMAL),(req, res) => {
  res.render("./account/index.ejs");
});

router.get("/login", (req, res) => {
  // ログインエラー用にflashを渡しておく
  res.render("./account/login.ejs", {message: req.flash("message")});
});

router.post("/login", authenticate());

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

// account.reviews.jsのルーティングを読み込む
// account/reviews/~のルーティングになる
router.use("/reviews", authorize(PRIVILEGE.NORMAL), require("./account.reviews.js"));

module.exports = router;