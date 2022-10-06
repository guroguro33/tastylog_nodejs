const PORT = process.env.PORT || 3000;
// pathモジュールを読み込む プロジェクトの様々なpathを取得するメソッドが使える
const path = require("path");
const express = require("express");
const app = express();

// Express setting 
app.set("view engine", "ejs"); // お約束

// Static resource rooting
app.use("/public", express.static(path.join(__dirname, "/public"))); // __dirnameはnode.jsで使用できる絶対パスを取得する特別な変数

// Dynamic resource rooting.
app.use("/", require("./routes/index.js"));

// Execute web application.
app.listen(PORT, () => {
  console.log(`Application listening at :${PORT}`);
});
