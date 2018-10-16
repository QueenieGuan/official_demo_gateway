const logger = require('log4js').getLogger('MSAdapter.js');
const BaseAdapter = require('./baseAdapter');
const HandlerFactory = require('../handler/ms/handlerFactory');

/**
 * MS Adapter
 * @author Xiaojun Guan
 */
class MSAdapter extends BaseAdapter {
  /**
   * send request for data
   * @param {string} eventType
   * @param {object} eventParams 
   */
  request(eventType, eventParams) {
    try {
      const handler = HandlerFactory.getHandler(eventType);
      logger.info(`handler ${handler}`);
      if (!handler) {
        throw new Error(`Cannot get ${eventType}Handler, please check.`)
      }
      // init DataSource Provider
      handler.init();
      // request data
      return handler.request(eventParams);
    }
    catch (err) {
      return Promise.reject(`MSAdapter Handler Request Failed. Error:${err}`);
    }
  }
}

module.exports = MSAdapter;