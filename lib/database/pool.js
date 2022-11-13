const { promisify } = require("util");
const config = require("../../config/mysql.config.js");
const mysql = require("mysql");
// コネクションプールを生成し、接続を共有する
const pool = mysql.createPool({
  host: config.HOST,
  port: config.PORT,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE,
  connectionLimit: config.CONNECTION_LIMIT,
  queueLimit: config.QUEUE_LIMIT
});
// promisifyを使用してpoolのメソッドを非同期化
module.exports = {
  pool,
  getConnection: promisify(pool.getConnection).bind(pool),
  executeQuery: promisify(pool.query).bind(pool),
  releaseConnection: function (connection) {
    connection.release();
  },
  end: promisify(pool.end).bind(pool)
};