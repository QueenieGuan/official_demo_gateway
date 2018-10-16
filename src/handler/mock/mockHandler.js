const ProviderFactory = require('../../provider/providerFactory');
const { PROVIDER_TYPE } = require('../../constant');
const Mock = require('mockjs');

/**
 * MockHandle Base Type
 * author: sharon
 */
class MockHandler {
  constructor() {
    /**
     * the provider type
     */
    this._providerType = null;

    /**
    * the mock data
    */
    this._mockData = null;

    /**
     * the mock data key
     */
    this.dataKey = '';

    /**
     * Mockjs instance
     */
    this.Mock = Mock;
  }

  /**
   * init provider by config 
   */
  init() {
    // set provider configs
    this.setProviderType();
    this.setMockData();

    /**
     * get the provider instance
    */
    this.provider = ProviderFactory.create({
      type: this._providerType,
      key: this._mockData
    })
  }

  /**
   * set the mock data
   */
  setMockData() {
    /**
    * the mock data
    */
    this._mockData = null;
  }

  /**
   * set MockJSProvider
   */
  setProviderType() {
    /**
    * the provider type
    */
    this._providerType = PROVIDER_TYPE.MOCKJS
  }

  /**
   * request for mock result
   * @param {object} commonProtocol 
   */
  request(commonProtocol) {
    return this.provider.query(this.dataKey, commonProtocol);
  }
}

module.exports = MockHandler;