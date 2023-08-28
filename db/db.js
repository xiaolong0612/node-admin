/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-28 18:37:12
 * @LastEditTime: 2023-08-28 22:47:53
 * @LastEditors: Amber
 */

const mongoose = require('mongoose');

const IP = ''
const PORT = ''
const DB_NAME = ''
const username = ''
const password = ''

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
