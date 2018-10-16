const logger = require("log4js").getLogger();
const {dateFormat} = require("../../utils");
const AdapterFactory = require("../../adapter/adapterFactory");
const HandlerType = require('../../handler/handlerType');
const Distance = require('../../distance');

// create an adapter instance
const adapter = AdapterFactory.create();
const quickSort = (list, left, right) => {
  if (left > right) {
    return;
  }
  let key = list[left].distance;
  let low = left;
  let high = right;
  while (left < right) {
    while(left < right && list[right].distance >= key) {
      right -= 1;
    }            
    list[left].distance = list[right].distance;
    while(left < right && list[left].distance <= key) {
      left += 1;
    }  
    list[right].distance = list[left].distance;
  }
  list[right].distance = key;
  quickSort(list,low,left-1);
  quickSort(list,left+1,high);
  return list;
};

// build resolver object for graphql
module.exports = {
  Query: {
    /**
     * 获取用户信息
     * @param {object} obj
     * @param {object} args 传入参数
     * @param {object} context
     */
    getAllKindergarten(obj, args, context) {
      // convert to commonProtocol
      let accountProtocol = {
        operation: "select",
        fields: [
          "Id",
          "name",
          "address",
          "gpsLng",
          "gpsLat",
          "gaodeLng",
          "gaodeLat",
          "baiduLng",
          "baiduLat",
          "city",
          "region",
          "price",
          "star",
          "score",
        ],
      };

      // get data by adapter request
      return adapter
        .request(HandlerType.GET_ALL_KINDERGARTEN_HANDLER, accountProtocol)
        .then(result => {
          let response = {};
          if (result.isSuccess) {
            response.data = result.kindergartenInfo;
            response.isSuccess = result.isSuccess;
            response.code = 200;
            response.total = result.kindergartenInfo.length;
          } else {
            response.data = {};
            response.isSuccess = result.isSuccess;
            response.code = 500;
            response.total = 0;
          }
          return response;
        })
        .catch(err => {
          logger.error(`[getKindergartenInfo error]: ${err}`);
          return {code: 500, msg: err, total: 0};
        });
    },
    getSearchResult(obj, args, context) {
      console.log(args, 'args');
      const priceObj = args.price.split('-');
      const minPrice = priceObj[0];
      const maxPrice = priceObj[1];
      // convert to commonProtocol
      let accountProtocol = {
        operation: "select",
        fields: [
          "Id",
          "name",
          "address",
          "gpsLng",
          "gpsLat",
          "gaodeLng",
          "gaodeLat",
          "baiduLng",
          "baiduLat",
          "city",
          "region",
          "price",
          "star",
          "score",
        ],
        where: [
          {
            type: "atom",
            field: "region",
            value: args.region,
            expression: "eq"
          },
          {
            type: "atom",
            field: "star",
            value: args.star,
            expression: "eq"
          },
          {
            type: "atom",
            field: "price",
            value: minPrice,
            expression: "ge"
          },
          {
            type: "atom",
            field: "price",
            value: maxPrice,
            expression: "le"
          }
        ],
      };

      // get data by adapter request
      return adapter
        .request(HandlerType.SEARCH_RESULT_HANDLER, accountProtocol)
        .then(result => {
          let response = {};
          if (result.isSuccess) {
            result.searchResultInfo.forEach((kindergarten) => {
              kindergarten.distance = Distance.calculateDistance(args.gpsLat,args.gpsLng,kindergarten.gpsLat, kindergarten.gpsLng);
            });
            response.data = quickSort(result.searchResultInfo, 0, result.searchResultInfo.length-1);
            response.data = result.searchResultInfo;
            response.isSuccess = result.isSuccess;
            response.code = 200;
            response.total = result.searchResultInfo.length;
          } else {
            response.data = {};
            response.isSuccess = result.isSuccess;
            response.code = 500;
            response.total = 0;
          }
          return response;
        })
        .catch(err => {
          logger.error(`[searchResultInfo error]: ${err}`);
          return {code: 500, msg: err, total: 0};
        });
    },
    getNearbyKindergarten(obj, args, context) {
      const minLng = args.gpsLng - 0.0224578390010066;
      const maxLng = args.gpsLng + 0.0224578390010066;
      const minLat = args.gpsLat - 0.0207429157999997;
      const maxLat = args.gpsLat + 0.0207429157999997;
      // convert to commonProtocol
      let accountProtocol = {
        operation: "select",
        fields: [
          "Id",
          "name",
          "address",
          "gpsLng",
          "gpsLat",
          "gaodeLng",
          "gaodeLat",
          "baiduLng",
          "baiduLat",
          "city",
          "region",
          "price",
          "star",
          "score",
        ],
        where: [
          {
            type: "atom",
            field: "gpsLng",
            value: minLng,
            expression: "ge"
          },
          {
            type: "atom",
            field: "gpsLng",
            value: maxLng,
            expression: "le"
          },
          {
            type: "atom",
            field: "gpsLat",
            value: minLat,
            expression: "ge"
          },
          {
            type: "atom",
            field: "gpsLat",
            value: maxLat,
            expression: "le"
          }
        ],
      };

      // get data by adapter request
      return adapter
        .request(HandlerType.GET_NEARBY_KINDERGARTEN_HANDLER, accountProtocol)
        .then(result => {
          let response = {};
          if (result.isSuccess) {
            result.nearbyKindergartenInfo.forEach((kindergarten) => {
              kindergarten.distance = Distance.calculateDistance(args.gpsLat,args.gpsLng,kindergarten.gpsLat, kindergarten.gpsLng);
            });
            response.data = quickSort(result.nearbyKindergartenInfo, 0, result.nearbyKindergartenInfo.length-1);
            response.isSuccess = result.isSuccess;
            response.code = 200;
            response.total = result.nearbyKindergartenInfo.length;
          } else {
            response.data = {};
            response.isSuccess = result.isSuccess;
            response.code = 500;
            response.total = 0;
          }
          return response;
        })
        .catch(err => {
          logger.error(`[nearbyKindergartenInfo error]: ${err}`);
          return {code: 500, msg: err, total: 0};
        });
    },
  },

  Mutation: {
  }
};