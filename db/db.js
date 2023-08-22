/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-28 18:37:12
 * @LastEditTime: 2023-08-17 02:12:40
 * @LastEditors: Amber
 */
module.exports = function() {
  const mongoose = require('mongoose');
  
  const IP = '124.71.153.68'
  const PORT = '27017'
  const DB_NAME = 'amber_com'
  const username = 'amber_com'
  const password = 'ZCFxwGbkR7GtKRSy'
  
  // 连接服务器的链接  把链接换成自己的服务器链接就可以了。
  // const uri = `mongodb+srv://${username}:${password}@${DB_NAME}.fbsqoas.mongodb.net/?retryWrites=true&w=majority`;
  const uri = `mongodb://${username}:${password}@${IP}:${PORT}/${DB_NAME}`;
  mongoose.connect(uri)
  return new Promise((resolve, reject) => {
    mongoose.connection.once('open', () => {
      resolve()
    })
    
    mongoose.connection.on('error', () => {
      reject()
    })
    
    mongoose.connection.on('close', () => {
      console.log('数据库连接关闭')
    })
  })
  
}
