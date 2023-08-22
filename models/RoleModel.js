/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-07-04 00:32:48
 * @LastEditTime: 2023-08-20 15:14:40
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')
const { datetimeToUnix } = require('../moment')
const RoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  desc: String,
  status: {
    type: Number,
    enum: [0, 1],
    default: 1
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

const RoleModel = mongoose.model('roles', RoleSchema)

module.exports = RoleModel