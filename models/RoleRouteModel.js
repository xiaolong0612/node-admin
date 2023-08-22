/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-09 12:10:18
 * @LastEditTime: 2023-08-20 15:14:32
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')
const { datetimeToUnix } = require('../moment')

const RoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "routers",
    required: true,
  },
  auth: Array
}, {
  timestamps: {
    currentTime: () => datetimeToUnix(),
    updatedAt: false
  }
})

const RoleRouteModel = mongoose.model('role_routes', RoleSchema)

module.exports = RoleRouteModel