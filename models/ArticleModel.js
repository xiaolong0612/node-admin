/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-30 01:00:59
 * @LastEditTime: 2023-08-20 15:14:48
 * @LastEditors: Amber
 */
const mongoose = require('mongoose')
const { datetimeToUnix } = require('../moment')

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  fans: {
    type: Number,
    default: 0
  },
  tagList: {
    type: Array,
    set(val) {
      if(val.length == 1 && val[0] === ''){
        return []
      }
      return val
    }
  },
  createdAt: Number,
  updatedAt: Number,
}, {
  timestamps: {
    currentTime: () => datetimeToUnix()
  }
})

const ArticleModel = mongoose.model('articles', ArticleSchema)

module.exports = ArticleModel