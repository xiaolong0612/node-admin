/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-28 18:17:07
 * @LastEditTime: 2023-08-20 15:14:04
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')
const { datetimeToUnix } = require('../moment')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: String,
  bio: String,
  createAt: Date,
  updateAt: Date,
}, {
  timestamps: {
    currentTime: () => datetimeToUnix()
  }
})

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel