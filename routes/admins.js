const express = require('express');
const router = express.Router();
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const _ = require('lodash');
const { randomString, checkPwdLevel } = require('../utils')
const { secret } = require('../config')
const AdminModel = require('../models/AdminModel')
const RoleModel = require('../models/RoleModel')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const searchMiddleware = require('../middleware/searchMiddleware')
const i18n = require('../middleware/i18nMiddleware')
const { datetimeToUnix } = require('../moment')

router.post('/login', function(req, res, next) {
  const { username, password } = req.body
  AdminModel.findOne({username: username}).then(async result => {
    if(result.password != md5(`${password}${result.salt}`)){
      return res.json({
        code: 20001,
        msg: '账号或密码错误'
      })
    }
    const hasPermission = await RoleModel.findOne({title: result.role, status: 1})
    if(!hasPermission){
      return res.json({
        code: 20001,
        msg: '暂无权限访问'
      })
    }
    // 1小时过期
    const token = jwt.sign({
      _id: result._id,
      username: result.username,
      password: result.password,
      date: datetimeToUnix(),
      role: result.role
    }, secret, { expiresIn: 60 * 60 })
    res.setHeader('authorization', token)
    res.setHeader('Access-Control-Expose-Headers','authorization')
    res.json({
      code: 20000,
      msg: i18n(req, 'loginSuccess'),
      data: { 
        _id: result._id,
        username: result.username,
        role: result.role,
        avatar: result.avatar
      }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '账号或密码错误'
    })
  })
});

router.get('/info', checkTokenMiddleware, function(req, res, next) {
  AdminModel.findOne({_id: req._id}, {password: 0}).then(data => {
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
  res.json({
    code: 20000,
    msg: '退出成功',
  })
});

router.get('/list', checkTokenMiddleware, searchMiddleware, function(req, res, next) {
  const params = req.query.params
  AdminModel.aggregate([
    {
      $match: req.filter.length != 0 ? {$and: req.filter} : {}
    }, {
      $project: {
        username: 1,
        avatar: 1,
        role: 1,
        readOnly: 1,
        createdAt: 1
      }
    }, {
      $skip: params.limit * (params.page - 1)
    }, {
      $limit: params.limit
    }
  ]).then(async data => {
    const total =  await AdminModel.find(req.filter.length != 0 ? {$and: req.filter} : {}).count()
    res.json({
      code: 20000,
      msg: '查询成功',
      data: {
        list: data,
        total
      }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '查询失败'
    })
  })
});
router.post('/', checkTokenMiddleware, async function(req, res, next) {
  const password = _.trim(req.body.password)
  const username = _.trim(req.body.username)
  if(username == '') return res.json({
    code: 20001,
    msg: '用户名不能为空'
  })
  if([0, 1].includes(checkPwdLevel(password))) {
    return res.json({
      code: 20001,
      msg: ['密码最少6位', '密码必须是小写字母、大写字母、数字、符号其中两个组合'][checkPwdLevel(password)]
    })
  }

  const admin = await AdminModel.findOne({username: _.trim(username)})
  if(admin){
    return res.json({
      code: 20001,
      msg: '用户名已存在'
    })
  }

  const salt = randomString(6)
  req.body.salt = salt
  req.body.password = md5(`${password}${salt}`)

  AdminModel.create(req.body).then(result => {
    res.json({
      code: 20000,
      msg: '添加成功',
      data: info
    })
  }).catch(err => {
    res.json({
      code: 20001,
      msg: '添加失败',
      data: err
    })
  })
});
router.patch('/', checkTokenMiddleware, async (req, res, next) => {
  const password = _.trim(req.body.password)
  const username = _.trim(req.body.username)

  if(username == '') return res.json({
    code: 20001,
    msg: '用户名不能为空'
  })
  
  if(password == '') delete req.body.password
  else {
    if([0, 1].includes(checkPwdLevel(password))) {
      return res.json({
        code: 20001,
        msg: ['密码最少6位', '密码必需包含大小写字母、数字、符号任意两者组合!'][checkPwdLevel(password)]
      })
    }
    const admin = await AdminModel.findOne({username: username})
    req.body.password = md5(`${password}${admin.salt}`)
  }
  AdminModel.updateOne({_id: req.body._id}, req.body).then(result => {
    res.json({
      code: 20000,
      msg: '更新成功',
      data: result
    })
  }).catch(err => {
    res.json({
      code: 20001,
      msg: '更新失败',
      data: err
    })
  })
});

router.patch('/pwd', checkTokenMiddleware, async (req, res, next) => {
  const _id = req.body._id
  const password = _.trim(req.body.password)
  const oldPassword = _.trim(req.body.oldPassword)
  
  if([0, 1].includes(checkPwdLevel(password))) {
    return res.json({
      code: 20001,
      msg: ['密码最少6位', '密码必需包含大小写字母、数字、符号任意两者组合!'][checkPwdLevel(password)]
    })
  }
  const admin = await AdminModel.findOne({_id})
  if(!admin) return res.json({
    code: 20001,
    msg: '用户不存在'
  })
  const oldPwd = md5(`${oldPassword}${admin.salt}`)
  const newPwd = md5(`${password}${admin.salt}`)
  if(oldPwd != admin.password) return res.json({
    code: 20001,
    msg: '旧密码错误'
  })

  AdminModel.updateOne({_id: req.body._id}, {password: newPwd}).then(result => {
    res.json({
      code: 20000,
      msg: '更新成功',
      data: result
    })
  }).catch(err => {
    res.json({
      code: 20001,
      msg: '更新失败',
      data: err
    })
  })
});
router.delete('/', checkTokenMiddleware, async function(req, res, next) {
  const info = await AdminModel.deleteMany({_id: {$in: req.body}})
  console.log(info)
  if(info.deletedCount == 0){
    return res.json({
      code: 20001,
      msg: '删除失败'
    })
  }
  res.json({
    code: 20000,
    msg: '删除成功',
    data: {
      total: info.deletedCount
    }
  })
});

module.exports = router;
