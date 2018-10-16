const path = require('path');
const logger = require('log4js').getLogger('HandlerFactory.js');

/**
 * Service Factory
 */
class ServiceFactory {
  static create(type, params) {
    if (!type) {
      throw new Error(`${type} is not defined`);
    }

    let file = path.join(__dirname, './modules/' + type);
    logger.info(`ServiceFactory find file ${file}.js`);

    const BaseService = require(file);
    if (!BaseService) {
      throw new Error(`${type} is not defined, please check.`)
    }

    // logger.info(`ServiceFactory get ${BaseService.contructor.name}`);
    logger.info(`ServiceFactory get ${BaseService.name}`);

    return new BaseService(params);
  }
}

module.exports = ServiceFactory;