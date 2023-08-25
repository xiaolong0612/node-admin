/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-29 23:34:48
 * @LastEditTime: 2023-08-25 18:41:56
 * @LastEditors: Amber
 */

function getBetweenVal(type, arr){
  if(type == 'BETWEEN_DATE') {
    return {one: new Date(arr[0]), two: new Date(arr[1])}
  }
  else return {one: Number(arr[0]), two: Number(arr[1])}
}
module.exports = (req, res, next) => {
  const filter = []
  const params = req.query.params
  const op = req.query.op
  if(!params){
    req.filter = filter
    next()
    return
  }
  const keys = Object.keys(params)
  
  keys.forEach(key => {
    let temp = {}
    if(op[key]){
      if(op[key] == 'LIKE' && params[key] != '') {
        temp[key] = new RegExp(params[key], 'i')
        filter.push({
          ...temp
        })
      } else if (op[key].includes('BETWEEN') && params[key] && params[key].length != 0) {
        const { one, two } = getBetweenVal(op[key], params[key])
        temp[key] = {$gte: one}
        filter.push({
          ...temp
        })
        temp[key] = {$lte: two}
        filter.push({
          ...temp
        })
      } else if(op[key]) {
        if(params[key] != ''){
          temp[key] = {}
          temp[key][op[key]] = params[key]
          filter.push({
            ...temp
          })
        }
      }
    } else {
      if(!['page', 'limit'].includes(key) && params[key] !== ''){
        temp[key] = {$eq: params[key]}
        filter.push({
          ...temp
        })
      } else {
        req.query.params[key] = Number(params[key])
      }
    }
  });
  req.filter = filter
  next()
}