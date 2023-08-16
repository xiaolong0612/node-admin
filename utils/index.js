/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-08 12:12:21
 * @LastEditTime: 2023-08-15 12:48:38
 * @LastEditors: Amber
 */
module.exports = {
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
  }
}