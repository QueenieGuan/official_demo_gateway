const { dbConfig } = require('../../config');
const { DBTYPE } = require('../../constant');
const mysql = require('mysql');
const Redshift = require('node-redshift')
const logger = require('log4js').getLogger('db -> dbPool.js');

/**
 * store db pool object
 */
class DBPool {
  constructor() {
    this.pools = {};
  }

  static getInstance() {
    if (DBPool._instance == null) {
      DBPool._instance = new DBPool();
    }

    return DBPool._instance;
  }

  /**
   * create all different kinds of db pools
   * store in pools
   */
  createDBPools() {
    if (!dbConfig) {
      logger.error('please add dbConfig in "./config.js" file.');
      throw new Error('no dbConfig be set.')
    }

    for (var key in dbConfig) {
      var config = dbConfig[key].connection;
      switch (dbConfig[key].type) {
        case DBTYPE.MYSQL:
          this.pools[key] = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port,
            connectionLimit: 50
          });

          // listening mysql pool
          this.pools[key].on('acquire', function (connection) {
          });

          this.pools[key].on('release', function (connection) {
          });
          break;
        case DBTYPE.REDSHIFT:
          this.pools[key] = new Redshift({
            user: config.user,
            database: config.database,
            password: config.password,
            port: config.port,
            host: config.host,
          });

          // listening redshift pool
          let connectCount = 0;
          this.pools[key].pool.on('connect', () => {
          });
          break;
        default:
          break;
      }

      logger.info(`create dbPool successfully, by config:${JSON.stringify(config)}`);
    }
  }

  /**
   * get one kind of db pool by config key
   * from pools object
   * @param {string} key pool key
   */
  getDBPool(key) {
    return this.pools[key];
  }
}

module.exports = DBPool;