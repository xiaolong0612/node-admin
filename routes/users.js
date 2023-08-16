const express = require('express');
const router = express.Router();
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const UserModel = require('../models/UserModel')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')

router.post('/login', function(req, res, next) {
  const { username, password } = req.body
  UserModel.findOne({username: username, password: md5(password)}).then(data => {
    // 1小时过期
    const token = jwt.sign({
      username: data.username,
      _id: data._id
    }, secret, { expiresIn: 60 * 60 })
    res.json({
      code: 20000,
      msg: '登陆成功',
      data: { token }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '账号或密码错误'
    })
  })
});

router.get('/info', checkTokenMiddleware, function(req, res, next) {
  UserModel.findOne({_id: req._id}, {password: 0}).then(data => {
    res.json({
      code: 20000,
      msg: '成功',
      data
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: ''
    })
  })
});

router.post('/logout', function(req, res, next) {
  // res.clearCookie('admin_token')
  res.json({
    code: 20000,
    msg: '退出成功',
  })
});

module.exports = router;
