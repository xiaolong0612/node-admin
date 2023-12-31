/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-30 01:02:10
 * @LastEditTime: 2023-08-25 14:27:58
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const ArticleModel = require('../models/ArticleModel')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const searchMiddleware = require('../middleware/searchMiddleware')

router.get('/list', checkTokenMiddleware, searchMiddleware, function(req, res, next) {
  const params = req.query.params
  ArticleModel.aggregate([
    {
      $match: req.filter.length != 0 ? {$and: req.filter} : {}
    }, {
      "$lookup": {
        "from": "admins",
        "localField": "author",
        "foreignField": "_id",
        "as": "user",
      }
    }, { 
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {$arrayElemAt: [ "$user", 0 ]}, "$$ROOT"
          ]
        }
      }
    }, {
      $project: {
        _id: 1,
        title: 1,
        author: 1,
        description: 1,
        body: 1,
        fans: 1,
        tagList: 1,
        createdAt: 1,
        updatedAt: 1,
        username: 1,
        avatar: 1
      }
    }, {
      $skip: params.limit * (params.page - 1)
    }, {
      $limit: params.limit
    }
  ]).then(async data => {
    const total =  await ArticleModel.find(req.filter.length != 0 ? {$and: req.filter} : {}).count()
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
  const article = await ArticleModel.create(req.body)
  if(!article){
    return res.json({
      code: 20001,
      msg: '添加失败'
    })
  }
  res.json({
    code: 20000,
    msg: '添加成功',
    data: article
  })
});
router.patch('/', checkTokenMiddleware, async function(req, res, next) {
  const article = await ArticleModel.updateOne({_id: req.body._id}, req.body)
  if(!article){
    return res.json({
      code: 20001,
      msg: '更新失败'
    })
  }
  res.json({
    code: 20000,
    msg: '更新成功',
    data: article
  })
});
router.delete('/', checkTokenMiddleware, async function(req, res, next) {
  const article = await ArticleModel.deleteMany({_id: {$in: req.body}})
  console.log(article)
  if(article.deletedCount == 0){
    return res.json({
      code: 20001,
      msg: '更新失败'
    })
  }
  res.json({
    code: 20000,
    msg: '删除成功',
    data: {
      total: article.deletedCount
    }
  })
});
module.exports = router;
