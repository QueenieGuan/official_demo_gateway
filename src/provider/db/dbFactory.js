const { dbConfig } = require('../../config');
const { DBTYPE } = require('../../constant');
const logger = require('log4js').getLogger();
const MySqlProvider = require('./mysql');
const MongodbProvider = require('./mongodb');
const RedshiftProvider = require('./redshift');

/**
 * DBFactory to support mysql or other db
 * author: Xiaojun Guan
 */
class DBFactory {
  /**
   * create DBprovider by dbConfig type
   * @param {string} configKey  DB config key
   */
  static createDBProvider(configKey) {
    // get db type from config
    let type = dbConfig[configKey].type;

    switch (type) {
      case DBTYPE.MYSQL:   // mysql 
        return new MySqlProvider();
      case DBTYPE.MONGODB: // mongodb
        return new MongodbProvider();
      case DBTYPE.REDSHIFT:
        return new RedshiftProvider();
      default:
        throw new error(`cannot find dbConfigKey "${configKey}" in "./config.js" file.`)
    }
  }
}

module.exports = DBFactory;