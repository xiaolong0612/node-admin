module.exports = (req, res, next) => {
  const filter = []
  const params = req.query.params
  const op = req.query.op
  Object.keys(params).forEach(key => {
    if(op[key]){
      if(op[key] == 'LIKE' && params[key] != '') {
        let temp = {}
        temp[key] = new RegExp(params[key], 'i')
        filter.push({
          ...temp
        })
      } else if (op[key] == 'BETWEEN' && params[key] && params[key].length != 0) {
        let temp = {}
        temp[key] = {$gte: params[key][0]}
        filter.push({
          ...temp
        })
        temp[key] = {$lte: params[key][1]}
        filter.push({
          ...temp
        })
      } else if(params[key]) {
        temp[key][op[key]] = params[key]
        filter.push({
          ...temp
        })
      }
    } else {
      if(!['page', 'limit'].includes(key) && params[key] !== ''){
        let temp = {}
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