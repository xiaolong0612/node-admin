/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-08-13 03:28:20
 * @LastEditTime: 2023-08-20 00:14:38
 * @LastEditors: Amber
 */
// 引入配置好的 multerConfig
const path = require('path')
const multerConfig = require('./multerConfig')

// 封装处理路径函数
const handlePath = (dir) => {
  return path.join(__dirname, './', dir)
}

// 上传到服务器地址
const BaseURL = 'http://localhost:3000' 
// 上传到服务器的目录
const imgPath = '/public/'

// 对图片进行去重删除和重命名
const hanldeImgDelAndRename = (id, filename, dirPath) => {
  // TODO 查找该路径下的所有图片文件
  fs.readdir(dirPath, (err, files) => {
    for (let i in files) {
      // 当前图片的名称
      const currentImgName = path.basename(files[i])
      // 图片的名称数组：[时间戳, id, 后缀]
      const imgNameArr = currentImgName.split('.')

      // TODO 先查询该id命名的文件是否存在，有则删除
      if (imgNameArr[1] === id) {
        const currentImgPath = dirPath + '/' + currentImgName
        fs.unlink(currentImgPath, (err) => { })
      }

      // TODO 根据新存入的文件名(时间戳.jpg)，找到对应文件，然后重命名为: 时间戳.id.jpg
      if (currentImgName === filename) {
        const old_path = dirPath + '/' + currentImgName
        const new_path = dirPath + '/' + imgNameArr[0] + '.' + id  + path.extname(files[i])
        // 重命名该文件
        fs.rename(old_path, new_path, (err) => { })
      }
    }
  })
}
// 上传头像接口的 请求参数req  响应参数res
function uploadAvatar(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.single('file')(req, res, function (err) {
      if (err) {
        reject(err)
      } else {
        const img = req.file.filename.split('.')
        // 重新返回符合规定的图片链接地址
        resolve(`${req.assetsPath}/${img[0]}.${img[1]}`)
      }
    })
  })
}
// 上传文件接口的 请求参数req  响应参数res
function upload(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.single('file')(req, res, function (err) {
      if (err) {
        reject(err)
      } else {
        const img = req.file.filename.split('.')
        // 重新返回符合规定的图片链接地址
        resolve(`${req.assetsPath}/${img[0]}.${img[1]}`)
      }
    })
  })
}

module.exports = {
  uploadAvatar,
  upload
}