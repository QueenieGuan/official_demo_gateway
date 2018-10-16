const mysql = require("mysql");
const logger = require("log4js").getLogger("mysql.js");
const sqlConvertor = require("./sqlConvertor");
const dbPool = require("../dbPool").getInstance();
const BaseProvider = require("../../baseProvider");
const async = require("async");
const SqlTransaction = require('./sqlTransaction');

/**
 * MySql query Provider
 * author: Xiaojun Guan
 */
class MySqlProvider extends BaseProvider {
  constructor() {
    super();
    this.pool = null;
  }

  /**
   * get dbPool by db config key
   * @param {string} configKey db config key
   */
  init(configKey) {
    this.pool = dbPool.getDBPool(configKey);
  }

  /**
   * query DB by db protocol
   * @param {object} protocol  db protocol
   */
  query(sql, sqlParams) {
    logger.info(`[MySQL Statement]: ${sql}`);
    logger.info(`[MySQL Parameter]: ${JSON.stringify(sqlParams)}`);

    return new Promise((resolve, reject) => {
      this.pool.getConnection(function (err, conn) {
        if (err) {
          logger.error(`[mysql database disconnect error]: ${err}`);
          reject(err);
        } else {
          conn.query(sql, sqlParams || [], function (err, res, fields) {
            conn.release();
            if (err) {
              logger.error(`[mysql query error]: ${err}`);
              reject(err);
            } else {
              logger.info(`[mysql query data]: ${JSON.stringify(res)}`);
              resolve(res, fields);
            }
          });
        }
      });
    });
  }

  /**
   * common procotol convert to mysql clause
   * @param {object} commonProcotol
   */
  sqlConvertor(commonProcotol) {
    return sqlConvertor(commonProcotol);
  }

  /**
   * query with transaction
   */
  createTransaction() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          logger.error(`[mysql database disconnect error]: ${err}`);
          reject(err);
        } else {
          resolve(new SqlTransaction(conn));
        }
      })
    });
  }
}

module.exports = MySqlProvider;
