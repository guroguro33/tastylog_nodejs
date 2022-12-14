// promisifyメソッドは引数に関数を入れるとpromise化してくれるnodeのutil
// パスの情報を返すクラス
const path = require("path");
// sqlを読み取って返す
const { sql } = require("@garafu/mysql-fileloader")({ root: path.join(__dirname, "./sql") });
// pool.jsでexportsしたオブジェクトを丸ごとpoolへ代入
const pool = require("./pool");
const Transaction = require("./transaction.js");

const MySQLClient = {
  // 通常のクエリ発行
  executeQuery: async function (query, values) {
    let results = await pool.executeQuery(query, values);
    return results;
  },
  // トランザクション
  beginTransaction: async function () {
    let tran = new Transaction();
    await tran.begin();
    return tran;
  }
};

module.exports = {
  MySQLClient,
  sql
};