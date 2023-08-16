/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-13 13:04:14
 * @LastEditTime: 2023-08-13 14:45:01
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
const { uploadAvatar } = require('../multer/upload')

router.post('/avatar', checkTokenMiddleware, async (req, res, next) => {
  // 头像目录
  req.assetsPath = '/avatar'
  const uploadRes = await uploadAvatar(req, res)
  if(!uploadRes){
    return res.json({
      code: 20001,
      msg: '上传失败'
    })
  }
  res.json({
    code: 20000,
    msg: '上传成功',
    data: uploadRes
  })
});

module.exports = router;
