const mongoose = require('mongoose')

const RouterSchema = new mongoose.Schema({
  parent_id: {
    type: String,
    default: ''
  },
  sort: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  component: {
    type: String,
    required: true,
  },
  hidden: Boolean,
  redirect: String,
  name: String,
  title: String,
  icon: String,
  auth: Array,
})

const RouterModel = mongoose.model('routers', RouterSchema)

module.exports = RouterModel