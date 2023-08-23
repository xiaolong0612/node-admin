/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-23 20:35:36
 * @LastEditTime: 2023-08-23 20:42:05
 * @LastEditors: Amber
 */
const express = require('express');
const router = express.Router();
const i18n = require('../middleware/i18nMiddleware')

router.get('/', function(req, res, next) {
  res.json({
    code: 20000,
    msg: i18n(req, 'demo')
  })
})

module.exports = router;
