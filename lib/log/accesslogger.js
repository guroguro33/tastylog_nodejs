const log4js = require("log4js");
const logger = require("./logger.js").access;
// ステータスコードでログレベルが調整できるautoがおすすsめ
const DEFAULT_LOG_LEVEL = "auto";

module.exports = function (options) {
  options = options || {};
  options.level = options.level || DEFAULT_LOG_LEVEL;
  options.format = options.format || function (req, res, format) {
    let address = req.headers["x-forwarded-for"] || req.ip;
    // 数値の繰り返し(\d+)の前は.か:(IPv6)、後ろは,か$を、$1と$2はそのままで間を0に置き換える
    // /xxx/gで当てはまるものをすべて置換するオプション
    address = address.replace(/(\.|:)\d+(,|$)/g, "$10$2");

    return format(
      // :xxxが変数
      `${address} ` +
      ":method " + 
      ":url " + 
      "HTTP/:http-version " + 
      ":status " + 
      ":response-time " + 
      ":user-agent " 
    );
  };
  return log4js.connectLogger(logger, options);
};