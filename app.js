const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();

app.set("view engine", "ejs"); // お約束

// ルーティング
app.use("/", require("./routes/index.js"));

// app.get("/", (req, res) => {
//   res.send("Hello, World");
// });
// モジュール化したルーティングを読み込み
// app.use("/home", require("./routes/router.js"));

app.listen(PORT, () => {
  console.log(`Application listening at ${PORT}`);
});