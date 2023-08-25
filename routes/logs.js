/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-25 11:54:48
 * @LastEditTime: 2023-08-25 18:53:46
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const searchMiddleware = require('../middleware/searchMiddleware')
const mongoose = require('mongoose')
const LogsSchema = new mongoose.Schema({})
const AdminLogsModel =  mongoose.model('admin_logs', LogsSchema)

router.get('/admin-login', checkTokenMiddleware, searchMiddleware, function(req, res, next) {
  const params = req.query.params
  AdminLogsModel.aggregate([
    {
      $match: req.filter.length != 0 ? {$and: req.filter} : {}
    }, { 
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            ['$meta', '$$ROOT']
          ]
        }
      }
    }, {
      $project: {
        _id: 1,
        timestamp: 1,
        level: 1,
        message: 1,
        user: 1,
        ip: 1,
        timestamp: 1,
        os: 1,
        browser: 1
      }
    }, {
      $sort: {
        timestamp: -1
      }
    },{
      $skip: params.limit * (params.page - 1)
    }, {
      $limit: params.limit
    }
  ]).then(async data => {
    const total =  await AdminLogsModel.find(req.filter.length != 0 ? {$and: req.filter} : {}).count()
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

module.exports = router;
