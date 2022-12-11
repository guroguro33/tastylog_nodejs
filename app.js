const PORT = process.env.PORT || 3000;
// pathモジュールを読み込む プロジェクトの様々なpathを取得するメソッドが使える
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const cookie = require("cookie-parser");
const app = express();

// Express setting 
app.set("view engine", "ejs"); // お約束
// セキュリティーのためレスポンスに含まれるx-powered-byを非表示にする
app.disable("x-powered-by");

// Expose global method to view engine.
app.use((req, res, next) => {
  // テンプレートエンジンで使える関数を登録
  res.locals.moment = require("moment");
  res.locals.padding = require("./lib/math/math.js").padding;
  next();
});

// Static resource rooting
// ファビコン
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public"))); // __dirnameはnode.jsで使用できる絶対パスを取得する特別な変数

// Set access log.（静的コンテンツまでアクセスログは不要のため、静的ファイルの後に記述する）
app.use(accesslogger());

// Set middleware
// cookie
app.use(cookie());
// フォームデータを読み込むため、urlencodedメソッドを使い、拡張をtrueとする
app.use(express.urlencoded({ extended: true }));

// Dynamic resource rooting.
app.use("/account", require("./routes/account"));
app.use("/search", require("./routes/search.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/", require("./routes/index.js"));

// Set application log.
app.use(applicationlogger());

// Execute web application.
app.listen(PORT, () => {
  logger.application.info(`Application listening at :${PORT}`);
});
