/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-09 12:10:18
 * @LastEditTime: 2023-08-13 18:55:13
 * @LastEditors: Amber
 */
const { type } = require('express/lib/response')
const mongoose = require('mongoose')

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
  timestamps: { createdAt: 'createdAt', updatedAt: false }
})

const RoleRouteModel = mongoose.model('role_routes', RoleSchema)

module.exports = RoleRouteModel