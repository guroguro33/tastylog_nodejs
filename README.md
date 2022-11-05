# node.js学習

## EJSテンプレートエンジン

```
// 値出力（エスケープ）
<%= 値 %>

// 値出力（エスケープなし）使用はincludeに限定させる
<%- 値 %>

// コード実行
<% コード %>

// コメント
<%# コメント %>
```

## セキュリティ
```
// セキュリティーのためレスポンスに含まれるx-powered-byを非表示にする
app.disable("x-powered-by");
```

# Log4js

JavaのLog4jをjs用に移植したもの
|要素|説明|
| ---- | ---- |
|Logger|ログ出力を行う実態、Loggerインスタンスのメソッド（error,infoなど）を使ってログ出力を行う|
|Category|ログ出力を分類するためのカテゴリ、分類毎にどこへ出力するのか（アペンダー）を指定する。|
|Appender|ログ出力方法、ConsoleAppender,FileAppenderなど具体的な出力先を定義|

```javascript
const log4js = require("log4js");

log4js.configure({
    // ログ出力方法
    appenders: {
        "consolelog": {type: "console"}
    },
    // カテゴリ設定
    categories: {
        // 出力先をappendersで指定
        "default": {appenders: ["consolelog"], level: "ALL"},
        "application": {appenders: ["consolelog"], level: "ERROR"},
    }
});

// loggerを取得
const logger = log4js.getLogger("application"); // カテゴリ名を引数に指定
logger.error("error message");
```