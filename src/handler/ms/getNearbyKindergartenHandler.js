const EventHandler = require("./eventHandler");
const logger = require("log4js").getLogger('getInfoFormHandler.js');
const ServiceFactory = require('../../service/serviceFactory');
const ServiceType = require('../../service/serviceType');

/**
 * query for kindergarten info
 * @deprecated db table is kindergarten_list
 * @author Xiaojun Guan
 */
class GetNearbyKindergartenHandler extends EventHandler {
  constructor() {
    super();

    this.getNearbyKindergartenService = null;
  }

  request(commonProtocol) {
    this.getNearbyKindergartenService = ServiceFactory.create(ServiceType.GET_NEARBY_KINDERGARTEN_SERVICE, this.provider);
    return this.getNearbyKindergartenService.getNearbyKindergarten(commonProtocol)
      .then(result => {
        return {
          isSuccess: true,
          nearbyKindergartenInfo: result.length > 0 ? result : {},
        };
      })
      .catch(err => {
        return {
          isSuccess: false,
          nearbyKindergartenInfo: {},
          error: err
        };
      });
  }
}

module.exports = GetNearbyKindergartenHandler;