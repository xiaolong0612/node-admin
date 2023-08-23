/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-23 19:18:14
 * @LastEditTime: 2023-08-23 19:59:47
 * @LastEditors: Amber
 */
const { handlePath }  = require('../utils/index')
const langModules = require(handlePath('public/lang'))
const querystring = require("querystring");
const _ = require('lodash');
// 默认语言
const languagesPackage = {
  defaultLanguage: "zh_CN",
  ...langModules
}

const i18n = (req, key) => {
  const languages = req.headers["accept-language"];
  // return langModules[lang]
  if (languages) {
    // 解析语言为 [{ name: 'zh-CN', q: 1 }, { name: 'en', q: '0.8' }] 格式
    let lans = languages.split(",").map(lang => {
      let [name, q = 1] = Object.keys(
          querystring.parse(_.trim(lang), ";q=")
      );
      // 修改命名，与语言库名字匹配
      name = _.replace(name, '-', '_')
      return { name, q };
    }).sort((a, b) => b.q - a.q); // 并按照权重逆序排序
    // 循环检测 languagesPackage 是否存在客户端的语言
    for (let i = 0; i < lans.length; i++) {
      let { name } = lans[i];
      let content = languagesPackage[name];
      // 如果存在直接设置响应头并返回内容
      if (content) {
        return languagesPackage[name][key]
      } else {
        return languagesPackage.defaultLanguage[key]
      }
    }
  }
  return languagesPackage.defaultLanguage[key]
}
module.exports = i18n