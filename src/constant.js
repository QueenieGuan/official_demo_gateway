module.exports = {
  // define adapter key
  ADAPTER: {
    EMP: 'EMP',
    MS: 'MS',
    MOCK: 'MOCK',
  },

  // define Protocol Key
  PROVIDER_TYPE: {
    DB: 'DB',
    HTTP: 'HTTP',
    MOCKJS: 'MOCKJS'
  },

  // define DBConfigKey
  DBCONFIG: {
    MS: 'MS-MYSQL',
    REDSHIFT: 'MS-REDSHIFT'
  },

  // define DBType
  DBTYPE: {
    MYSQL: 'mysql',
    MONGODB: 'mongodb',
    REDSHIFT: 'redshift'
  },

  // define httpConfigKey
  HTTPCONFIG: {
    MS: 'MS'
  },

  // define token auth key
  AUTHCONFIG: {
    SECRET_KEY: 'mobisummer|secret|2018-03-19',
    ALGORITHM: 'seed',
  }
}