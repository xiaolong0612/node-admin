/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-28 18:37:12
 * @LastEditTime: 2023-08-24 21:36:38
 * @LastEditors: Amber
 */

const mongoose = require('mongoose');

const IP = '124.71.153.68'
const PORT = '27017'
const DB_NAME = 'amber_com'
const username = 'amber_com'
const password = 'ZCFxwGbkR7GtKRSy'

module.exports = {
  uri: `mongodb://${username}:${password}@${IP}:${PORT}/${DB_NAME}`,
  connect: function() {
    mongoose.connect(this.uri)
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
}
