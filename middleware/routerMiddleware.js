/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-29 18:33:09
 * @LastEditTime: 2023-08-22 14:38:44
 * @LastEditors: Amber
 */
const _ = require('lodash');
const mongoose = require('mongoose')
/**
 * 
 * @param {*} data 路由数据
 * @param {*} nodes 权限路由
 * 
 * @returns 
 */
const formatMenu = (children, routes, roleNodes = []) => {
  // 排序
  return menuSort(menuRecursion(children, routes, roleNodes));
}
// 递归菜单
function menuRecursion(children, routes, roleNodes, level = 0){
  let menu = []
  children.map(route => {
      let temp = {}
      const hasPermisson = roleNodes.filter(node => node.route_id.toString() == route._id.toString())
      const auth = roleNodes.length == 0 ? route.auth : hasPermisson[0]?.auth
      if(hasPermisson.length != 0 || roleNodes.length == 0){
        if(level == 0){
          if(!route.parent_id){
            temp = addRoute(routes, route, roleNodes, auth, level)
          }
        } else {
          temp = addRoute(routes, route, roleNodes, auth, level)
        }
      }
      if(temp._id) menu.push(temp)
    })
    return menu
}

function addRoute(routes, route, roleNodes, auth, level){
  if(route.menuType == 0) {
    let temp = getRealRoute(route, auth, level)
    const children = routes.filter(item => item.parent_id && (item.parent_id.toString() == route._id.toString()))
    if(children.length != 0) {
      temp.children = menuRecursion(children, routes, roleNodes, level + 1)
    }
    return temp
  }else{
    return getRealRoute(route, auth, level)
  }
}

// 菜单排序
function menuSort (list) {
  return _.orderBy(list, ['meta.sort'], ['desc']);
}

/**
* 获取路由标准
*/
function getRealRoute(route, auth, level) {
  let temp = {
    _id: route._id,
    parent_id: route.parent_id,
    hidden: route.hidden,
    menuType: route.menuType,
    openType: route.openType,
    // 路由地址
    path: route.path,
    // 组件路径
    component: level == 0 ? 'Layout' : route.component,
    meta: {
      sort: route.sort
    }
  }
  // 如果只有一级
  if(!route.parent_id && route.menuType == 1){
    temp.children = [{
      component: route.component,
      path: route.path,
      meta: {
        title: route.title,
        icon: route.icon,
        auth: auth,
        sort: route.sort
      }
    }]
  } else {
    if(level != 0 || !route.parent_id) {
      temp.meta.title = route.title
      temp.meta.icon = route.icon
      temp.meta.auth = auth
    }
  }
  // 路由基本格式
  return temp
}

/**
 * 格式化请求中的路由参数
 * @param {*} route 
 * @returns 
 */
function formatRouter(route){
  delete route._id
  let params = {}
  Object.keys(route).map(key => {
    params[key] = key.includes('_id') ? (!route[key] ? null : new mongoose.Types.ObjectId(route[key])) : route[key]
  })
  return params
}

module.exports = {
  formatMenu,
  formatRouter
}