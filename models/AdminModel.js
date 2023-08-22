/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-07-03 19:33:50
 * @LastEditTime: 2023-08-20 15:14:55
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')
const { datetimeToUnix } = require('../moment')

const AdminSchema = new mongoose.Schema({
  avatar: {
    type: String,
    set(val) {
      if(val === '') return 'https://img0.baidu.com/it/u=189649806,2789154204&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
      return val
    }
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  salt: {
    type: String,
    required: true
  },
  role: {
    type: String,
    ref: 'roles',
    required: true
  },
  readOnly: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Number
  }
}, {
  timestamps: {
    currentTime: () => datetimeToUnix(),
    updatedAt: false
  }
})

const AdminModel = mongoose.model('admins', AdminSchema)

module.exports = AdminModel