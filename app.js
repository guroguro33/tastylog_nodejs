const PORT = process.env.PORT;
const express = require("express");
const app = express();

// ルーティング
app.get("/", (req, res) => {
  res.end("Hello, World");
});

// ミドルウエア
app.use(() => {
  
});

app.listen(PORT, () => {
  console.log(`Application listening at ${PORT}`);
});