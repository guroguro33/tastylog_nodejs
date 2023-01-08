const path = require("path");
const LOG_ROOT_DIR = process.env.LOG_ROOT_DIR || path.join(process.cwd(), "./logs");

module.exports = {
  appenders: {
    // 任意の名称をつける
    ConsoleLogAppender: {
      type: "console"
    },
    ApplicationLogAppender: {
      type: "dateFile", // 日ファイル
      filename: path.join(LOG_ROOT_DIR, "./application.log"),
      pattern: "yyyyMMdd",
      numBackups: 7 // 7日間保持
    },
    AccessLogAppender: {
      type: "dateFile",
      filename: path.join(LOG_ROOT_DIR, "./access.log"),
      pattern: "yyyyMMdd",
      numBackups: 7
    }
  },
  categories: {
    // defaultは必要
    "default": {
      appenders: ["ConsoleLogAppender"], // appendersの任意名称を指定
      level: "ALL"
    },
    // 個別設定を追加
    "application": {
      appenders: [
        "ApplicationLogAppender", // ログファイル出力設定
        "ConsoleLogAppender" // コンソール出力の設定
      ],
      level: "INFO"
    },
    "access": {
      appenders: [
        "AccessLogAppender",
        "ConsoleLogAppender"
      ],
      level: "INFO"
    }
  }
};