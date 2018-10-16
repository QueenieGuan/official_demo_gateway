const path = require('path');
const fs = require('fs');
const logger = require('log4js').getLogger('HandlerFactory.js');

/**
 * MockHandlerFactory
 * @author Xiaojun Guan
 */
class HandlerFactory {
  /**
   * create a mock instance
   * @param {string} type class type 
   */
  static getHandler(type) {
    if (!type) {
      throw new Error(`${type} is not defined`);
    }

    // get defined handler file
    let file = path.join(__dirname, './' + type);
    logger.info(`HandlerFactory find file ${file}.js`);

    // require defined handler
    const EventHandler = require(file);
    if (!EventHandler) {
      throw new Error(`${type} is not defined, please check.`)
    } 
    logger.info(`HandlerFactory get ${EventHandler.name}`);
    // return single instance
    this._instance = this._instance || {};
    if (this._instance[EventHandler.name] === undefined) {
      this._instance[EventHandler.name] = new EventHandler();
    }
    return this._instance[EventHandler.name];
  }
}

module.exports = HandlerFactory;