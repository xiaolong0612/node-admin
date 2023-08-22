/*
 * @Description: redis
 * @Author: Amber
 * @Date: 2023-08-20 22:53:14
 * @LastEditTime: 2023-08-21 00:00:20
 * @LastEditors: Amber
 */
// 连接
// redisClient.connect(6379, '124.71.153.68', {
//   password: 995664
// })

const redis = require('redis')
const redisClient = redis.createClient({
    url: 'redis://:995664@124.71.153.68:6379/0',
    /* 
    * redis://[[username][:password]@][host][:port][/db-number]
    * 写密码redis://:123456@124.71.153.68:6379/DB0 
    * 写用户redis://uername@127.0.0.1:6379/0  
    * 或者不写密码 redis://127.0.0.1:6379/0
    * 或者不写db_number redis://:127.0.0.1:6379
    * */
});
;(async () =>{
  redisClient.on('ready', () => {
      console.log('redis is ready...')
  })

  redisClient.on('error', err => {
      console.log(err)
  })

  await redisClient.connect()   // 连接

  /* 增 改*/
  // const status = await redisClient.set('key', 'value') // 设置值
  // console.log(status )

  /* 查 */
  // const value = await redisClient.get('key') // 得到value 没有则为null
  // console.log(value )

  /* 删 */
  // const num = await redisClient.del('key') // 0 没有key关键字 // 1删除成功
  // console.log(num )

  // await redisClient.quit()
})()

module.exports = redisClient