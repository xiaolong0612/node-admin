/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-20 13:23:12
 * @LastEditTime: 2023-08-22 16:38:30
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const fs = require('fs')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const { handlePath, objArrToObj } = require('../utils/index')
const ConfigModel = require('../models/SysConfigModel')

router.get('/timezone', function(req, res, next) {
  fs.readFile(handlePath('/utils/timezone.json'), 'UTF-8', (err, data) => {
    if(err){
      console.error(err)
    }else{
      res.json({
        code: 20000,
        msg: '查询成功',
        data: JSON.parse(data)
      })
    }
  })
});

router.get('/', function(req, res, next) {
  ConfigModel.find().then(result => {
    res.json({
      code: 20000,
      msg: '查询成功',
      data: objArrToObj(result)
    })
  })
});

router.patch('/', checkTokenMiddleware, async (req, res, next) => {
  const keys = Object.keys(req.body)
  index = 0
  async function update(){
    const key = keys[index]
    const val = req.body[key]
    console.log(key, val)
    const haskey = await ConfigModel.findOne({key: key})
    if(haskey) await ConfigModel.updateOne({key: key}, {value: val})
    else await ConfigModel.create({key: key, value: val})
    if(index < keys.length - 1) {
      index++
      update()
    }
    else{
      res.json({
        code: 20000,
        msg: '更新成功'
      })
    }
  }
  update(index)
  // Object.keys(req.body).map(async key => {
  //   const haskey = await ConfigModel.findOne({key: key})
  //   if(haskey) await ConfigModel.updateOne({key: key}, {value: req.body[key]})
  //   else await ConfigModel.create({key: key}, {value: req.body[key]})
  // })
  // res.json({
  //   code: 20000,
  //   msg: '更新成功'
  // })
});

module.exports = router;
