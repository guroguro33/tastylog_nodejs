const btnSubmit_onclick = function () {
  const $submit = $(this);
  const $form = $submit.parents("form");
  $form.attr("method", $submit.data("method"));
  $form.attr("action", $submit.data("action"));
  $form.submit();
  // イベントを削除して、ボタンを非活性化
  $submit.off().props("disabled", true);
  // submit動作を無効
  $form.on("submit", false);
};

const document_onready = () => {
  $("input[type='submit']").on("click", btnSubmit_onclick);
};

$(document).ready(document_onready);