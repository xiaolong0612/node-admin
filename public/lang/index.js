const fs = require("fs");
const currentDirPath = __dirname;
const currentFilePath = __filename
// 获取当前文件的名字，包含扩展名。
const currentFileName = currentFilePath
    .replace(currentDirPath, '')
    .substring(1);

const langModules = {}
const filenames = fs.readdirSync(currentDirPath)
if (filenames) {
  // 遍历文件
  for (let index = 0; index < filenames.length; index++) {
    const element = filenames[index];
    const key = element.split('.js')[0]
    if (element !== currentFileName) {
      // require 加载
      langModules[key] = require(`${currentDirPath}/${element}`);
    }
  }
}
module.exports = langModules