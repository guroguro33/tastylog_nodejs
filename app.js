const PORT = process.env.PORT;
const express = require("express");
const app = express();

// ルーティング
app.get("/", (req, res) => {
  res.send("Hello, World");
});

// モジュール化したルーティングを読み込み
app.use("/home", require("./routes/router.js"));


app.listen(PORT, () => {
  console.log(`Application listening at ${PORT}`);
});