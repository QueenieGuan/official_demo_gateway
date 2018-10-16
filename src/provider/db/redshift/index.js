const redshift = require('node-redshift');
const logger = require('log4js').getLogger('RedshiftProvider.js');
const sqlConvertor = require('./sqlConvertor');
const dbPool = require("../dbPool").getInstance();
const BaseProvider = require('../../baseProvider');

/**
 * Redshift query Provider
 * author: Xiaojun Guan
 */
class RedshiftProvider extends BaseProvider {
  constructor() {
    super();
    this.pool = null;
  }

  /**
   * get dbPool by db config key
   * @param {string} configKey db config key
   */
  init(configKey) {
    logger.debug('redshift configkey: ' + configKey);
    this.pool = dbPool.getDBPool(configKey);
  }

  /**
   * query DB by db protocol
   * @param {object} protocol  db protocol
   */
  query(sql, sqlParams) {
    return new Promise((resolve, reject) => {
      if (sqlParams && sqlParams.length > 0) {
        let index = 0;
        sql = sql.replace(/\?/g, () => {
          return '$' + (++index);
        });
      }

      this.pool.parameterizedQuery(sql, sqlParams, { raw: true }, function (err, res) {
        if (err) {
          logger.error(`redshift query error: ${err}`);
          reject(err);
        } else {
          logger.info(`redshift query data:${JSON.stringify(res)}`);
          resolve(res);
        }
      });
    });
  }

  /**
   * common procotol convert to redshift clause
   * @param {object} commonProcotol 
   */
  sqlConvertor(commonProcotol) {
    return sqlConvertor(commonProcotol);
  }
}

module.exports = RedshiftProvider;