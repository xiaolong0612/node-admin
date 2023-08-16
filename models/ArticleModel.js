const mongoose = require('mongoose')

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
    type: mongoose.Schema.ObjectId,
    required: true
  },
  favorite: Boolean,
  favoritesCount: {
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
    currentTime: ()=> Date.now()
  }
})

const ArticleModel = mongoose.model('articles', ArticleSchema)

module.exports = ArticleModel