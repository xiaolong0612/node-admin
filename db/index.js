const db = require('./db')

module.exports = function () {
  return new Promise((resolve, reject) => {
    db.connect().then(() => {
      console.log('数据库连接成功...')
      resolve()
    }).catch(() => {
      console.log('数据库连接失败！！！')
      reject()
    })
  })
}