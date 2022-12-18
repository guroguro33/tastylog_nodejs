const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("./account/login.ejs");
});

router.use("/reviews", require("./account.reviews.js"));

module.exports = router;