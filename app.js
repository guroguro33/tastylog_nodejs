const PORT = process.env.PORT || 3000;
// pathモジュールを読み込む プロジェクトの様々なpathを取得するメソッドが使える
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();

// Express setting 
app.set("view engine", "ejs"); // お約束
// セキュリティーのためレスポンスに含まれるx-powered-byを非表示にする
app.disable("x-powered-by");

// Static resource rooting
// ファビコン
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public"))); // __dirnameはnode.jsで使用できる絶対パスを取得する特別な変数

// Set access log.（静的コンテンツまでアクセスログは不要のため、静的ファイルの後に記述する）
app.use(accesslogger());

// Dynamic resource rooting.
app.use("/", require("./routes/index.js"));
app.use("/test", async (req, res, next) => {
  // promisifyメソッドは引数に関数を入れるとpromise化してくれるnodeのutil
  const { promisify } = require("util");
  // パスの情報を返すクラス
  const path = require("path");
  // sqlを読み取って返す
  const { sql } = require("@garafu/mysql-fileloader")({ root: path.join(__dirname, "./lib/database/sql") });
  const config = require("./config/mysql.config.js");
  const mysql = require("mysql");
  const con = mysql.createConnection({
    host: config.HOST,
    port: config.PORT,
    user: config.USERNAME,
    password: config.PASSWORD,
    database: config.DATABASE
  });
  // promisifyを使用してconのメソッドを非同期化
  const client = {
    connect: promisify(con.connect).bind(con),
    query: promisify(con.query).bind(con),
    end: promisify(con.end).bind(con)
  };
  var data;

  try {
    await client.connect();
    data = await client.query(await sql("SELECT_SHOP_BASIC_BY_ID"));
    console.log(data);
  } catch (err) {
    next(err);
  } finally {
    await client.end();
  }
  res.end("OK");
});

// Set application log.
app.use(applicationlogger());

// Execute web application.
app.listen(PORT, () => {
  logger.application.info(`Application listening at :${PORT}`);
});
