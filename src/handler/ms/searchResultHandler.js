const EventHandler = require("./eventHandler");
const logger = require("log4js").getLogger('getInfoFormHandler.js');
const ServiceFactory = require('../../service/serviceFactory');
const ServiceType = require('../../service/serviceType');

/**
 * query for kindergarten info
 * @deprecated db table is kindergarten_list
 * @author Xiaojun Guan
 */
class SearchResultHandler extends EventHandler {
  constructor() {
    super();

    this.searchResultService = null;
  }

  request(commonProtocol) {
    this.searchResultService = ServiceFactory.create(ServiceType.SEARCH_RESULT_SERVICE, this.provider);
    return this.searchResultService.searchResult(commonProtocol)
      .then(result => {
        return {
          isSuccess: true,
          searchResultInfo: result.length > 0 ? result : {},
        };
      })
      .catch(err => {
        return {
          isSuccess: false,
          searchResultInfo: {},
          error: err
        };
      });
  }
}

module.exports = SearchResultHandler;