module.exports = {
  PORT: process.env.PORT || 3000,
  security: {
    SESSION_SECRET: "YOUR_SESSION_SECRET_STRING"
  },
  search: {
    // 検索時のページあたりの最大表示数
    MAX_ITEM_PER_PAGE: 5
  }
};