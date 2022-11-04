const PORT = process.env.PORT || 3000;
// pathモジュールを読み込む プロジェクトの様々なpathを取得するメソッドが使える
const path = require("path");
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

// Dynamic resource rooting.
app.use("/", require("./routes/index.js"));

// Execute web application.
app.listen(PORT, () => {
  console.log(`Application listening at :${PORT}`);
});
