const EARTH_RADIUS = 6371.0; //km 地球半径 平均值，千米

class Distance {
  constructor() {
  }

  static HaverSin(theta) {
    const v = Math.sin(theta / 2);
    return v * v;
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    //用haversine公式计算球面两点间的距离。
    //经纬度转换成弧度
    lat1 = this.ConvertDegreesToRadians(lat1);
    lon1 = this.ConvertDegreesToRadians(lon1);
    lat2 = this.ConvertDegreesToRadians(lat2);
    lon2 = this.ConvertDegreesToRadians(lon2);
    //差值
    const vLon = Math.abs(lon1 - lon2);
    const vLat = Math.abs(lat1 - lat2);
    //h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
    const h = this.HaverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * this.HaverSin(vLon);
    const distance = 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
    return distance;
  }

  static ConvertDegreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  static ConvertRadiansToDegrees(radian) {
    return radian * 180.0 / Math.PI;
  }
}

module.exports = Distance;