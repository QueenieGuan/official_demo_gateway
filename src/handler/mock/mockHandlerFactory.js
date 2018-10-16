const path = require('path');
const fs = require('fs');
const logger = require('log4js').getLogger('MockHandlerFactory.js');

/**
 * MockHandlerFactory
 * @author sharon
 */
class MockHandlerFactory {
  /**
   * create a mock instance
   * @param {string} type class type 
   */
  static getHandler(type) {
    if (!type) {
      throw new Error(`${type} is not defined`);
    }

    let file = path.join(__dirname, './' + type);
    logger.info(`MockHandlerFactory find file ${file}.js`);

    const MockHandler = require(file);
    if (!MockHandler) {
      throw new Error(`${type} is not defined, please check.`)
    }

    logger.info(`MockHandlerFactory get ${MockHandler.name}`);

    // single instance
    this._instance = this._instance || {};
    if (this._instance[MockHandler.name] === undefined) {
      this._instance[MockHandler.name] = new MockHandler();
    }

    return this._instance[MockHandler.name];
  }
}

module.exports = MockHandlerFactory;