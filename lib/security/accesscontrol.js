const passport = require("passport");
// passport-localからStrategyメソッドを呼ぶ
const LocalStrategy = require("passport-local").Strategy;
const { MySQLClient, sql } = require("../database/client.js");
// 特権
const PRIVILEGE = {
  NORMAL: "normal" // 今回は通常権限のみ
};
let initialize, authenticate, authorize;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  "local-strategy",
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true // trueにするとasyncの第１引数がreqになる
  }, async (req, username, password, done) => {
    // （独自の認証処理）DBから取得する
    let results, user;
    try {
      results = await MySQLClient.executeQuery(
        await sql("SELECT_USER_BY_EMAIL"),
        [username]
      );
    } catch (err) {
      return done(err);
    }
    if (results.length === 1 &&
      password === results[0].password) {
      user = {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        permissions: [PRIVILEGE.NORMAL]
      };
      // セッションを再作成
      req.session.regenerate((err) => {
        if (err) {
          done(err);
        } else {
          // doneの第１引数はerr、第２引数はわたす変数
          done(null, user);
        }
      });
    } else {
      // 失敗時
      done(null, false, req.flash("message", "ユーザー名 または パスワードが間違っています"));
    }
  })
);

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

// 認証
authenticate = function () {
  return passport.authenticate(
    "local-strategy",
    {
      successRedirect: "/account",
      failureRedirect: "/account/login"
    }
  );
};

// 認可
authorize = function (privilege) {
  return function (req, res, next) {
    // 認証しているか？権限があるか？
    if (req.isAuthenticated() &&
       ((req.user.permissions || []).indexOf(privilege) >= 0)) {
      next();
    } else {
      res.redirect("/account/login");
    }
  };
};

module.exports = {
  initialize,   // 初期化
  authenticate, // 認証
  authorize,    // 認可
  PRIVILEGE     // 特権
};