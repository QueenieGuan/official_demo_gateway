const EventHandler = require("./eventHandler");
const logger = require("log4js").getLogger('getInfoFormHandler.js');
const ServiceFactory = require('../../service/serviceFactory');
const ServiceType = require('../../service/serviceType');

/**
 * query for kindergarten info
 * @deprecated db table is kindergarten_list
 * @author Xiaojun Guan
 */
class GetAllKindergartenHandler extends EventHandler {
  constructor() {
    super();

    this.getAllKindergartenService = null;
    // this.provider为null
    // this.getAllKindergartenService = ServiceFactory.create(ServiceType.GET_ALL_KINDERGARTEN_SERVICE, super.provider);
  }

  request(commonProtocol) {
    // this.provider继承了父类的provider
    this.getAllKindergartenService = ServiceFactory.create(ServiceType.GET_ALL_KINDERGARTEN_SERVICE, this.provider);
    return this.getAllKindergartenService.getAllKindergarten(commonProtocol)
      .then(result => {
        return {
          isSuccess: true,
          kindergartenInfo: result.length > 0 ? result : {},
        };
      })
      .catch(err => {
        return {
          isSuccess: false,
          kindergartenInfo: {},
          error: err
        };
      });
  }
}

module.exports = GetAllKindergartenHandler;