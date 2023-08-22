/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-20 14:15:10
 * @LastEditTime: 2023-08-20 15:12:34
 * @LastEditors: Amber
 */
const moment = require('moment')
const timezone = require('moment-timezone')

const currentUnix = timezone(new Date()).tz("America/Toronto").unix()
const unixToDatetime = (unix) => {
  return moment.unix(unix).tz("America/Toronto").format('YYYY/MM/DD HH:mm:ss')
}
const datetimeToUnix = (date = new Date()) => {
  return timezone(date).tz("America/Toronto").unix()
}
// console.log(currentUnix)
console.log('系统启动时间：' + unixToDatetime(currentUnix))
// console.log(datetimeToUnix())

module.exports = {
  moment,
  timezone,
  currentUnix,
  unixToDatetime,
  datetimeToUnix
}