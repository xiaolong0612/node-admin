/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-08 12:12:21
 * @LastEditTime: 2023-08-25 01:59:43
 * @LastEditors: Amber
 */
const path = require('path')

module.exports = {
  // 封装处理路径函数
  handlePath: (dir) => {
    return path.join(__dirname, '../', dir)
  },
  /**
   * 随机字符串
   * @param {Number} length 
   * @returns 
   */
  randomString: (length) => {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) 
        result += str[Math.floor(Math.random() * str.length)];
    return result;
  },
  /**
   * 密码强度
   * @param {String} pwd 
   * @returns 
   */
  checkPwdLevel: (pwd, len = 6) => {
    let level = 0;
    if (pwd.length < len) return 0
    if (pwd.match(/[a-z]/g)) level++
    if (pwd.match(/[A-Z]/g)) level++
    if (pwd.match(/[0-9]/g)) level++
    if (pwd.match(/[!@#$%^&*(),.?":{}|<>]/g)) level++
    if (pwd.length > 13) level++
    return level
  },
  /**
   * object[] to object
   */
  objArrToObj: (list) => {
    return list.reduce((obj, item) => (obj[item.key] = item.value,obj), {})
  },
  /**
   * 
   * @param {*} req 
   * @returns 客户端真实ip
   */
  getClientIp: (req) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
    return ip;  
  }
}
