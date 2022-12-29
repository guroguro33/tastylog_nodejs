const {
  ACCOUNT_LOCK_WINDOW,
  ACCOUNT_LOCK_THRESHOLD,
  ACCOUNT_LOCK_TIME,
  MAX_LOGIN_HISTORY
} = require("../../config/application.config.js").security;
const bcrypt = require("bcrypt");
const moment = require("moment");
const passport = require("passport");
// passport-localからStrategyメソッドを呼ぶ
const LocalStrategy = require("passport-local").Strategy;
const { MySQLClient, sql } = require("../database/client.js");
// 特権
const PRIVILEGE = {
  NORMAL: "normal" // 今回は通常権限のみ
};
const LOGIN_STATUS = {
  SUCCESS: 0,
  FAILURE: 1
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
    let transaction, results, user, count;
    var now = new Date();
    try {
      // Start transaction
      transaction = await MySQLClient.beginTransaction();

      // Get user info
      results = await transaction.executeQuery(
        await sql("SELECT_USER_BY_EMAIL_FOR_UPDATE"),
        [username]
      );
      if (results.length !== 1) {
        await transaction.commit();
        return done(null, false, req.flash("message", "ユーザー名 または パスワードが間違っています"));
      }

      // user情報の生成
      user = {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        permissions: [PRIVILEGE.NORMAL]
      };

      // Check account lock status
      if (results[0].locked &&
        moment(now).isSameOrBefore(
          moment(results[0].locked).add(ACCOUNT_LOCK_TIME, "minutes")
        )) {
        await transaction.commit(); 
        return done(null, false, req.flash("message", "アカウントがロックされています。"));
      }

      // Delete old login log
      // [MAX_LOGIN_HISTORY - 1]以前のログを削除
      await transaction.executeQuery(
        await sql("DELETE_LOGIN_HISTORY"),
        [user.id, user.id, MAX_LOGIN_HISTORY - 1]
      );

      // passwordの不一致時
      if (!await bcrypt.compare(password, results[0].password)) {
        // Insert login history
        await transaction.executeQuery(
          await sql("INSERT_LOGIN_HISTORY"),
          [user.id, now, LOGIN_STATUS.FAILURE]
        );

        // Lock account, if need
        let tmp = await transaction.executeQuery(
          await sql("COUNT_LOGIN_HISTORY"),
          [
            user.id, 
            moment(now).subtract(ACCOUNT_LOCK_WINDOW, "minutes").toDate(),
            LOGIN_STATUS.FAILURE
          ]
        );
        // TODO:countの中身を確認しておくこと
        count = (tmp || [])[0].count;
        if (count >= ACCOUNT_LOCK_THRESHOLD) {
          await transaction.executeQuery(
            await sql("UPDATE_USER_LOCKED"),
            [now, user.id]
          );
        }

        await transaction.commit();
        return done(null, false, req.flash("message", "ユーザー名 または パスワードが間違っています"));
      }

      // Insert login history
      await transaction.executeQuery(
        await sql("INSERT_LOGIN_HISTORY"),
        [user.id, now, LOGIN_STATUS.SUCCESS]
      );

      // Unlocked account
      await transaction.executeQuery(
        await sql("UPDATE_USER_LOCKED"),
        [null, user.id]
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      return done(err);
    }

    // セッションを再作成
    req.session.regenerate((err) => {
      if (err) {
        done(err);
      } else {
        // doneの第１引数はerr、第２引数はわたす変数
        done(null, user);
      }
    });
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