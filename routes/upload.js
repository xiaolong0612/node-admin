/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-13 13:04:14
 * @LastEditTime: 2023-08-20 00:14:37
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const { uploadAvatar, upload } = require('../multer/upload')

router.post('/avatar', checkTokenMiddleware, (req, res, next) => {
  // 头像目录
  req.assetsPath = '/avatar'
  uploadAvatar(req, res).then(result => {
    res.json({
      code: 20000,
      msg: '上传成功',
      data: result
    })
  }).catch(err=> {
    res.json({
      code: 20001,
      msg: '上传失败',
      data: err
    })
  })
});
router.post('/', checkTokenMiddleware, (req, res, next) => {
  // 文件目录
  req.assetsPath = '/uploads'
  upload(req, res).then(result => {
    res.json({
      code: 20000,
      msg: '上传成功',
      data: result
    })
  }).catch(err=> {
    res.json({
      code: 20001,
      msg: '上传失败',
      data: err
    })
  })
});

module.exports = router;
