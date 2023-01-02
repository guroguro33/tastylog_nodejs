// グローバルに変数を置いてしまう危険性を排除するため関数に入れる
(function () {
  window.cookieconsent.initialise({
    "palette": {
      "popup": {
        "background": "#edeff5",
        "text": "#838391"
      },
      "button": {
        "background": "#4b81e8"
      }
    },
    "theme": "classic",
    "position": "bottom-left",
    "type": "opt-in",
    "content": {
      "message": "当社では、本サイトでの体験を向上させ、コンテンツや広告のパーソナライズ、トラフィック分析のため、Cookieを利用します。",
      "deny": "すべて拒否",
      "allow": "すべて許可",
      "link": "プライバシーポリシー",
      "href": "/public/help/privacy-policy.html"
    },
    // ステータスが変更されたときの動作
    "onStatusChange": function (status, chosenBefore) {
      if (this.hasConsented()) {
        // 同意時
        console.log("Allow"); // Google Analyticsなどの許可実装
      } else {
        console.log("Deny"); // Google Analyticsなどの拒否実装
      }
    }
  });
})();