/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-29 18:33:09
 * @LastEditTime: 2023-08-16 13:30:59
 * @LastEditors: Amber
 */
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const AdminModel = require('../models/AdminModel')

module.exports = {
  checkTokenMiddleware: (req, res, next) => {
    const token = req.headers['admin_token']
    if(!token){
      return res.json({
        code: 50008,
        msg: '验证失败'
      })
    }
    jwt.verify(token, secret, async (err, data) => {
      if(err){
        return res.json({
          code: 50008,
          msg: '验证失败'
        })
      }
      req._id = data._id
      req.role = data.role
      const admin = await AdminModel.findOne({username: data.username})
      if(admin){
        if(admin.password != data.password) {
          return res.json({
            code: 50008,
            msg: '登陆密码已过期，请重新登陆'
          })
        } 
        next()
      } else return res.json({
        code: 50008,
        msg: '您没有权限操作'
      })
      
    })
  }
}