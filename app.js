const IS_PRODUCTION = process.env.NODE_ENV === "production";
const appconfig = require("./config/application.config.js");
const dbconfig = require("./config/mysql.config.js");
// pathモジュールを読み込む プロジェクトの様々なpathを取得するメソッドが使える
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const accesscontrol = require("./lib/security/accesscontrol.js");
const express = require("express");
const favicon = require("serve-favicon");
const cookie = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
// エラーメッセージを画面上に表示させるツール
const flash = require("connect-flash");
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
// session
app.use(session({
  // mysqlの設定
  store: new MySQLStore({
    host: dbconfig.HOST,
    port: dbconfig.PORT,
    user: dbconfig.USERNAME,
    password: dbconfig.PASSWORD,
    database: dbconfig.DATABASE
  }),
  cookie: {
    // HTTPS通信に限定するか（prodのみHTTPS）
    secure: IS_PRODUCTION
  },
  // secretは必須
  secret: appconfig.security.SESSION_SECRET,
  // 強制保存
  resave: false,
  // 未初期化のセッションを保存するかどうか
  saveUninitialized: true,
  // セッション名
  name: "sid"
}));
// フォームデータを読み込むため、urlencodedメソッドを使い、拡張をtrueとする
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(...accesscontrol.initialize());

// Dynamic resource rooting.
app.use("/account", require("./routes/account"));
app.use("/search", require("./routes/search.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/", require("./routes/index.js"));

// Set application log.
app.use(applicationlogger());

// Execute web application.
app.listen(appconfig.PORT, () => {
  logger.application.info(`Application listening at :${appconfig.PORT}`);
});
