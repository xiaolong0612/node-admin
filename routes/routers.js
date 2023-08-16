const express = require('express');
const router = express.Router();
const _ = require('lodash');

const RouterModel = require('../models/RouterModel')
const { checkTokenMiddleware } = require('../middleware/checkTokenMiddleware')
/**
 * 
 * @param {*} data 路由数据
 * @param {*} nodes 权限路由
 * 
 * @returns 
 */
const formatMenu = (data, nodes = false) => {
  // 菜单
  let menu = []
  // 未匹配路由数据
  const otherRouters = []
  data.map(item => {
    // 一级菜单
    if (item.parent_id == '') {
      if(nodes){
        // 权限路由匹配
        const roleRoute = nodes.filter(n_item => n_item.route_id.toString() == item._id.toString())
        if(roleRoute.length != 0){
          menu.push(getRealRoute(Object.assign(item, {auth: roleRoute[0].auth})))
        }
      }
      else menu.push(getRealRoute(item))
    }
    else otherRouters.push(item)
  })
  menu = _.orderBy(menu, ['meta.sort'], ['desc']);
  return menuRecursion(menu, otherRouters, nodes)
}
/**
 * routers  未匹配路由数据
 * menu     当前子类菜单集合
 */
function menuRecursion( menu = [], routers = [], nodes = false) {
  menu.forEach((m_item) => {
    const tempChildren = routers.filter(router => router.parent_id == m_item._id.toString())
    if(tempChildren.length != 0){
      const tempChildrenSort = _.orderBy(tempChildren, ['sort'], ['desc']);
      // 移除已使用的路由
      tempChildrenSort.map(item => {
        if(!m_item.children) m_item.children = []
        if(nodes){
          // 权限路由
          const roleRoute = nodes.filter(n_item => n_item.route_id.toString() == item._id.toString())
          if(roleRoute.length != 0){
            m_item.children.push(getRealRoute(Object.assign(item, {auth: roleRoute[0].auth})))
          }
        } else m_item.children.push(getRealRoute(item))
        routers = routers.filter(allRouter => allRouter._id !== item._id)
      })
      // 递归下级
      menuRecursion(m_item.children, routers, nodes)
    }
  })
  return menu
}

/**
* 获取路由标准
*/
function getRealRoute(route) {
  // 路由基本格式
  return {
    _id: route._id,
    parent_id: route.parent_id,
    hidden: route.hidden,
    // 路由的路径
    path: route.path,
    // 路由重定向
    redirect: route.redirect,
    // 路由名
    name: route.name,
    // 路由所在组件
    component: route.component,
    meta: {
      title: route.title,
      icon: route.icon,
      auth: route.auth,
      sort: route.sort
    }
  }
}

/**
 * 格式化请求中的路由参数
 * @param {*} route 
 * @returns 
 */
function formatRouter(route){
  let params = {}
  Object.keys(route).map(key => {
    if(key == 'meta'){
      Object.keys(route.meta).map(key => {
        params[key] = route.meta[key]
      })
    } else {
      params[key] = route[key]
    }
  })
  return params
}
router.get('/list', checkTokenMiddleware, function(req, res, next) {
  RouterModel.find().then(async data => {
    res.json({
      code: 20000,
      data: {
        list: formatMenu(data)
      }
    })
  }).catch(() => {
    res.json({
      code: 20001,
      msg: '查询失败'
    })
  })
});

router.post('/', checkTokenMiddleware, async function(req, res, next) {
  const route = await RouterModel.create(formatRouter(req.body))
  if(!route){
    return res.json({
      code: 20001,
      msg: '添加失败'
    })
  }
  res.json({
    code: 20000,
    msg: '添加成功',
    data: route
  })
});
router.patch('/', checkTokenMiddleware, async function(req, res, next) {
  const route = await RouterModel.updateOne({_id: req.body._id}, formatRouter(req.body))
  if(!route){
    return res.json({
      code: 20001,
      msg: '更新失败'
    })
  }
  res.json({
    code: 20000,
    msg: '更新成功',
    data: route
  })
});
router.delete('/', checkTokenMiddleware, async function(req, res, next) {
  const route = await RouterModel.deleteMany({_id: {$in: req.body}})
  if(route.deletedCount == 0){
    return res.json({
      code: 20001,
      msg: '删除失败'
    })
  }
  res.json({
    code: 20000,
    msg: '删除成功',
    data: {
      total: route.deletedCount
    }
  })
});

module.exports = {
  router,
  formatMenu
};


