const BaseService = require('../baseService');
const logger = require("log4js").getLogger('getInfoFormHandler.js');

class GetAllKindergartenService extends BaseService {
  constructor(provider) {
    super(provider);
  }

  getAllKindergarten(protocol) {
    protocol.from = "kindergarten_list";
    let { sql, sqlParams } = this.provider.sqlConvertor(protocol);
    return this.provider.query(sql, sqlParams)
      .then(data => data || [])
      .catch(err => {
        return [];
      });
  }
}


module.exports = GetAllKindergartenService;