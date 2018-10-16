const BaseProvider = require('../../baseProvider');

class MongodbProvider extends BaseProvider {
  init(configKey) {

  }

  query(protocol) {
    return new Promise((resolve, reject) => {
    });
  }
}

module.exports = MongodbProvider;