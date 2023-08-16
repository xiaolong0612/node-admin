const { type } = require('express/lib/response')
const mongoose = require('mongoose')

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
  timestamps: { createdAt: 'createdAt', updatedAt: false }
  // timestamps: true
})

const RoleModel = mongoose.model('roles', RoleSchema)

module.exports = RoleModel