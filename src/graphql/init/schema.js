module.exports = {
  /**
   * define graphql query methods
   */
  query: `
    getAllKindergarten: KindergartenInfoList   
    getSearchResult(region:String star:String price:String gpsLng:Float gpsLat:Float): NearKindergartenInfoList
    getNearbyKindergarten(gpsLng:Float gpsLat:Float): NearKindergartenInfoList
  `,

  /**
   * define graphql mutation methods
   */
  mutation: `
    deleteStudentRecord(Id: Int): MutateResult
  `,

  /**
   * define graphql 'input' and 'type' dataType
   */
  definition: `
    type MutateResult{
      code: Int
      isSuccess: Boolean
      msg: String
    }

    type KindergartenInfo{
      Id:Int
      name: String
      address: String
      gpsLng: Float
      gpsLat: Float
      gaodeLng: Float
      gaodeLat: Float
      baiduLng: Float
      baiduLat: Float
      city: String
      region: String
      price: Int
      star: String
      score: Float
    }

    type NearbyKindergartenInfo{
      Id:Int
      name: String
      address: String
      gpsLng: Float
      gpsLat: Float
      gaodeLng: Float
      gaodeLat: Float
      baiduLng: Float
      baiduLat: Float
      city: String
      region: String
      price: Int
      star: String
      distance: Float
      score: Float
    }

    type KindergartenInfoList{
      data: [KindergartenInfo]
      isSuccess: Boolean
      code: Int
      total: Int
    }

    type NearKindergartenInfoList{
      data: [NearbyKindergartenInfo]
      isSuccess: Boolean
      code: Int
      total: Int
    }
  `
};