const log4js = require("log4js");
const config = require("../../config/log4js.config.js");
let console;

// 設定を読み込む
log4js.configure(config);

// console logger.
console = log4js.getLogger();

module.exports = {
  console
};