const devConfig = require('./config.dev.js');
const prodConfig = require('./config.prod.js');
const testConfig = require('./config.test.js');

// get the process argvs
const args = process.argv.slice(2);
if (args[0] === '--env') {
  process.env.NODE_ENV = args[1] || 'development';
}

let config;
switch (process.env.NODE_ENV) {
  case "production":
    config = prodConfig;
    break;
  case "test":
    config = testConfig;
    break;
  default:
    config = devConfig;
    break;
}

module.exports = config;


