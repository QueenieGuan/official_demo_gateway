const { ADAPTER, DBCONFIG, HTTPCONFIG } = require('../constant');

module.exports = {
  /**
  * server config 
  */
  serverConfig: {
    port: 5003,
    host: 'http://localhost:5003'
  },

  /**
   * log4js config
   */
  logConfig: {
    appenders: {
      out: { type: 'stdout' },
      file: {
        type: 'dateFile',
        filename: './log/cheese.log',
        daysTokeep: 7,
        layout: {
          type: 'pattern',
          pattern: '%d %p %c %m%n',
        },
      },
      errorLog: {
        type: 'file',
        filename: './log/error.log',
        layout: {
          type: 'pattern',
          pattern: '%d %p %c %m%n',
        },
      },
      error: {
        type: 'logLevelFilter',
        appender: 'errorLog',
        level: 'error',
      },
    },
    categories: {
      default: {
        appenders: ['file', 'error'], level: 'info'
      },
    },
  },

  /**
   * adapter config
   * options: 'ADAPTER.EMP','ADAPTER.MS' or 'ADAPTER.MOCK'
   */
  adapterConfig: ADAPTER.MS,

  /**
   * db Protocol config
   */
  dbConfig: {
    [DBCONFIG.MS]: {
      type: 'mysql',
      connection: {
        // product env, !!!no setting
        host: 'mobicenter.capk9cdjzjgv.us-west-2.rds.amazonaws.com',
        user: 'readonly',
        password: 'XaFNNcfYY4rU',
        database: 'adplatform',
        port: 3306
      }
    },
    [DBCONFIG.REDSHIFT]: {
      type: 'redshift',
      connection: {
        host: 'moses.cmccrtmh0qgx.us-west-2.redshift.amazonaws.com',
        user: 'moses',
        password: 'MosesCenter2016',
        database: 'moses',
        port: 5439
      }
    },
    // TODO: set more config
  },

  /**
   * http Protocol config
   */
  httpConfig: {
    [HTTPCONFIG.MS]: 'http://localhost:5003/',
    // TODO: set more config
  },
}


