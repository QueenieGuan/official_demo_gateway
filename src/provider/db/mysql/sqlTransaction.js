const logger = require('log4js').getLogger('sqlTransaction.js');

/**
 * SqlTransaction
 * @author Xiaojun Guan
 * @description query with transaction
 */
class SqlTransaction {
  constructor(connection) {
    // create connection
    this.connection = connection;
  }

  /**
   * Begin a transaction
   * @return Promise
   */
  beginTransaction() {
    let sqlTrans = this;

    return new Promise((resolve, reject) => {
      sqlTrans.connection.beginTransaction((err) => {
        if (err) {
          logger.error(`[Begin Transaction Error]: ${err}`);
          sqlTrans.connection.release();
          reject(err);
        } else {
          resolve(sqlTrans);
        }
      })
    })
  }

  /**
   * sql execute
   * @param {string} sql       查询sql
   * @param {object} sqlParams 查询参数
   * @param {boolean} isCommit 是否提交事务
   */
  query(sql, sqlParams, isCommit) {
    logger.info(`[SQL Statement With Transaction]: ${sql}`);
    logger.info(`[SQL Parameter With Transaction]: ${JSON.stringify(sqlParams)}; isCommit: ${isCommit}`)

    let sqlTrans = this;

    return new Promise((resolve, reject) => {
      sqlTrans.connection.query(sql, sqlParams, (err, result) => {
        if (err) {
          sqlTrans.connection.rollback((rbErr) => {
            if (rbErr) {
              logger.error(`[Transaction Rollback Error]: ${rbErr}`);
            }

            sqlTrans.connection.release();
            reject(err);
          });
        } else {
          if (isCommit) {
            sqlTrans.connection.commit((err) => {
              if (err) {
                logger.error(`[Transaction Commit Error]: ${err}`)

                sqlTrans.connection.rollback(rbErr => {
                  if (rbErr) {
                    logger.error(`[Transaction Rollback after Commit Error]: ${rbErr}`);
                  }

                  sqlTrans.connection.release();
                  reject(err);
                })
              } else {
                sqlTrans.connection.release();
                resolve([sqlTrans, result]);
              }
            })
          } else {
            resolve([sqlTrans, result]);
          }
        }
      })
    })
  }
}

module.exports = SqlTransaction;