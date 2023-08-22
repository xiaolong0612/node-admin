/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-07-05 16:28:31
 * @LastEditTime: 2023-08-22 02:02:14
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();

const RouterModel = require('../models/RouterModel')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const { formatRouter } = require('../middleware/routerMiddleware')

router.get('/list', checkTokenMiddleware, function(req, res, next) {
  RouterModel.find().then(async result => {
    res.json({
      code: 20000,
      data: {
        list: result
      }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '查询失败'
    })
  })
});

router.post('/', checkTokenMiddleware, function(req, res, next) {
  RouterModel.create(formatRouter(req.body)).then(result => {
    res.json({
      code: 20000,
      msg: '添加成功',
      data: result
    })
  }).catch(err => {
    res.json({
      code: 20001,
      msg: '添加失败',
      data: err
    })
  })
});
router.patch('/', checkTokenMiddleware, (req, res, next) => {
  RouterModel.updateOne({_id: req.body._id}, formatRouter(req.body)).then(result => {
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
router.delete('/', checkTokenMiddleware, (req, res, next) => {
  RouterModel.deleteMany({_id: {$in: req.body}}).then(result => {
    res.json({
      code: 20000,
      msg: '删除成功',
      data: {
        total: result.deletedCount
      }
    })
  }).catch(err => {
    res.json({
      code: 20001,
      msg: '删除失败',
      data: err
    })
  })
});

module.exports = router


