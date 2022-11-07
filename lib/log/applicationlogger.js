// エラーログを出力するミドルウエア

// applicationのloggerを呼び出す
const { logger } = require("./logger.js");

module.exports = function () {
  return function (err, req, res, next) {
    logger.error(err.message);
    next(err);
  };
};