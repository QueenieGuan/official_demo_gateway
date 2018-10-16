module.exports = {
  /** 
   * Format Date
   * e.g. 
   * dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
   * dateFormat(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  */
  dateFormat(date, formatStr) {
    if (!date) {
      return;
    };

    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };

    if (/(y+)/.test(formatStr)) {
      formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length == 1) ?
          (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return formatStr;
  }
}
