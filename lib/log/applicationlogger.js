// エラーログを出力するミドルウエア

// applicationのloggerを呼び出す
const logger = require("./logger.js").application;

module.exports = function () {
  return function (err, req, res, next) {
    logger.error(err.message);
    next(err);
  };
};