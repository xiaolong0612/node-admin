/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-09 17:07:50
 * @LastEditTime: 2023-08-15 11:42:13
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const RoleRouteModel = require('../models/RoleRouteModel')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')

router.get('/', checkTokenMiddleware, function(req, res, next) {
  const params = JSON.parse(req.query.params)
  RoleRouteModel.aggregate([
    {
      $match: {_id: new mongoose.Types.ObjectId(params_id)}
    }, {
      $project: {
        _id: 1,
        title: 1,
        desc: 1,
        status: 1,
        createdAt: 1
      }
    }, {
      $skip: params.limit * (params.page - 1)
    }, {
      $limit: params.limit
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
  await RoleRouteModel.deleteMany({role: req.body[0].role})
  RoleRouteModel.insertMany(req.body).then(result => {
    if(!result){
      return res.json({
        code: 20001,
        msg: '授权失败'
      })
    }
    res.json({
      code: 20000,
      msg: '授权成功',
    })
  }).catch(err => {
    return res.json({
      code: 20001,
      msg: err
    })
  })
  
});

module.exports = router;
