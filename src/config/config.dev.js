const {
  ADAPTER,
  DBCONFIG,
  HTTPCONFIG
} = require('../constant');

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
      out: {
        type: 'stdout'
      },
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
        appenders: ['out', 'error'],
        level: 'debug'
      },
    },
  },

  /**
   * adapter config
   * options: 'ADAPTER.MS' or 'ADAPTER.MOCK'
   */
  adapterConfig: ADAPTER.MS,

  /**
   * db Protocol config
   */
  dbConfig: {
    [DBCONFIG.MS]: {
      type: 'mysql',
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'kindergarten',
        port: 3306
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