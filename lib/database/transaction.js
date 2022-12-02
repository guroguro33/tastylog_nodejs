const pool = require("./pool.js");

let Transaction = class {
  constructor (connection) {
    this.connection = connection;
  } 
  async begin () {
    // コネプをリリース
    if (this.connection) {
      this.connection.release();
    }
    // 新しいコネプを取得してトランザクション開始
    this.connection = await pool.getConnection();
    this.connection.beginTransaction();
  } 
  async executeQuery (query, values, options = {}) {
    options = {
      fields: options.fields || false
    };
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, results, fields) => {
        if (!err) {
          resolve(!options.fields ? results : { results, fields });
        } else {
          reject(err);
        }
      });
    });
  }
  async commit() {
    return new Promise((resolve, reject) => {
      this.connection.commit((err) => {
        // コネクションを開放し、初期化しておく
        this.connection.release();
        this.connection = null;
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
  async rollback() {
    return new Promise((resolve, reject) => {
      this.connection.rollback(() => {
        this.connection.release();
        this.connection = null;
        resolve();
      });
    });
  }
};

module.exports = Transaction;