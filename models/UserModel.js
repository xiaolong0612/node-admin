const mongoose = require('mongoose')

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
})

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel