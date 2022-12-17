const window_onpopstate = function (event) {
  // 戻るボタン時も空履歴を追加する
  history.pushState(null, null, null);
};

const document_onready = function (event) {
  // ブラウザのセッション履歴スタックに状態を追加
  // history.pushState(state, title[, url])
  history.pushState(null, null, null);
  // popstateイベントはブラウザ履歴を追加後に戻るボタンを押下した際に発火
  $(window).on("popstate", window_onpopstate);
};

$(document).ready(document_onready);