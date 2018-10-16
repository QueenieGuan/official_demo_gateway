const MockHandlerFactory = require('../handler/mock/mockHandlerFactory');
const BaseAdapter = require('./baseAdapter');

/**
 * Mock Adapter
 * @author sharon
 */
class MockAdapter extends BaseAdapter {
  /**
   * send request for data
   * @param {string} eventType
   * @param {object} eventParams
   */
  request(eventType, eventParams) {
    try {
      const handler = MockHandlerFactory.getHandler(eventType);
      if (!handler) {
        throw new Error(`MockHandlerFactory cannot get ${eventType}Handler.`);
      }

      // mock init
      handler.init();
      // request data;
      return handler.request(eventParams);
    } catch (err) {
      // catch exception
      return Promise.reject(`MockAdapter Handler Request Failed. Error:${err}`)
    }
  }
}

module.exports = MockAdapter;