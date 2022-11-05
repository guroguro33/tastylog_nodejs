module.exports = {
  appenders: {
    // 任意の名称をつける
    ConsoleLogAppender: {
      type: "console"
    }
  },
  categories: {
    // defaultは必要
    "default": {
      appenders: ["ConsoleLogAppender"], // appendersの任意名称を指定
      level: "ALL"
    }
  }
};