const passport = require("passport");
let initialize, authenticate, authorize;

initialize = function () {
  return [
    passport.initialize(),
    passport.session(),
    function (req, res, next) {
      // リクエストにuser情報があればログイン状態と判断
      if (req.user) {
        // responseのlocalsのuserにuser情報を渡してviewで使う
        res.locals.user = req.user;
      }
      next();
    }
  ];
};

module.exports = {
  initialize,   // 初期化
  authenticate, // 認証
  authorize      // 認可
};