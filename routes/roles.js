/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-07-04 00:54:38
 * @LastEditTime: 2023-08-15 12:28:39
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const RoleModel = require('../models/RoleModel')
const RoleRouteModel = require('../models/RoleRouteModel')
const RouterModel = require('../models/RouterModel')
const { formatMenu } = require('./routers');
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')

router.get('/list', checkTokenMiddleware, function(req, res, next) {
  const params = req.query.params
  RoleModel.aggregate([
    {
      $match: req.filter.length != 0 ? {$and: req.filter} : {}
    }, {
      $project: {
        _id: 1,
        title: 1,
        readOnly: 1,
        desc: 1,
        status: 1,
        createdAt: 1
      }
    }
  ]).then(async data => {
    res.json({
      code: 20000,
      msg: '查询成功',
      data: {
        list: data
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
  const role = await RoleModel.create(req.body)
  if(!role){
    return res.json({
      code: 20001,
      msg: '添加失败'
    })
  }
  res.json({
    code: 20000,
    msg: '添加成功',
    data: role
  })
});
router.patch('/', checkTokenMiddleware, async function(req, res, next) {
  const role = await RoleModel.updateOne({_id: req.body._id}, req.body)
  if(!role){
    return res.json({
      code: 20001,
      msg: '更新失败'
    })
  }
  res.json({
    code: 20000,
    msg: '更新成功',
    data: role
  })
});
router.delete('/', checkTokenMiddleware, async function(req, res, next) {
  const role = await RoleModel.deleteMany({_id: {$in: req.body}})
  if(role.deletedCount == 0){
    return res.json({
      code: 20001,
      msg: '删除失败'
    })
  }
  res.json({
    code: 20000,
    msg: '删除成功',
    data: {
      total: role.deletedCount
    }
  })
});



/**
 * 根据登陆角色获取路由
 */
router.get('/list/role', checkTokenMiddleware, async function(req, res, next) {
  let nodes = false
  if(req.role !== '超级管理员') nodes = await RoleRouteModel.find({role: req.role})
  RouterModel.find().then(async data => {
    res.json({
      code: 20000,
      data: {
        list: formatMenu(data, nodes)
      }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '查询失败'
    })
  })
});

/**
 * 获取角色路由节点
 */
router.post('/list/roleRoute', checkTokenMiddleware, async function(req, res, next) {
  RoleRouteModel.find(req.body).then(async data => {
    res.json({
      code: 20000,
      data: {
        list: data
      }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '查询失败'
    })
  })
});

module.exports = router;
