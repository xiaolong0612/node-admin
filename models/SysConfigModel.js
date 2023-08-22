/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-07-03 19:33:50
 * @LastEditTime: 2023-08-21 00:21:48
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')

const ConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  value: {
    type: String,
    trim: true,
  }
}, {
  timestamps: { createdAt: false, updatedAt: false }
})

const ConfigModel = mongoose.model('sys_config', ConfigSchema)

module.exports = ConfigModel