const ProviderFactory = require('../../provider/providerFactory');
const { DBCONFIG, PROVIDER_TYPE } = require('../../constant');
const logger = require('log4js').getLogger('EventHandler.js');


/**
 * EventHandler Base Type
 */
class EventHandler {
  constructor() {
    /**
    * only one provider
    */
    this.provider = null;
    /**
    * support more providers
    * for example：
    * this.providers = {'DBProvider': DBProvider, 'HttpProvider': HttpProvider}
    */
    this.providers = {};
    /**
    * Provider configs
    * support array
    */
    this.providerConfigs = {};
  }
  /**
   * set Provider configs
   */
  setProviderConfigs() {
    /**
     * Provider configs
     * support array
     */
    this.providerConfigs = {
      type: PROVIDER_TYPE.DB,
      key: DBCONFIG.MS
    };
  }

  /**
   * init configs to use Provider
   */
  init() {
    // get Provider Configs
    this.setProviderConfigs();
    const providers = ProviderFactory.create(this.providerConfigs);

    if (providers instanceof Array) {
      providers.forEach((provider, index) => {
        /**
         * support more Providers
         * for example：
         * this.Providers = {'DBProvider': DBProvider, 'HttpProvider': HttpProvider}
         */
        this.providers[provider.constructor.name] = provider;
      })
    } else {
      /**
       * only one Provider
       */
      this.provider = providers;
    }
  }

  /**
   * request for service result
   * @param {object} commonProtocol 
   */
  request(commonProtocol) { }
}

module.exports = EventHandler;