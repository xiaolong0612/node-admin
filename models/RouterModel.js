/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-07-04 14:54:04
 * @LastEditTime: 2023-08-22 11:12:17
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')
const RouterSchema = new mongoose.Schema({
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: ''
  },
  menuType: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },
  openType: {
    type: Number,
    default: 0,
    enum: [0, 1, 2]
  },
  component: {
    type: String,
    default: "Layout"
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  sort: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: true
  },
  hidden: {
    type: Number,
    default: 1,
    enum: [0, 1]
  },
  icon: String,
  auth: Array,
}, {
  timestamps: {
    createdAt: false,
    updatedAt: false
  }
})

const RouterModel = mongoose.model('routers', RouterSchema)

module.exports = RouterModel