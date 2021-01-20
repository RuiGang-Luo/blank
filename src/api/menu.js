import request from '@/utils/request'

export function toSaveSort (sortList) {
  return request({
    url: '/business/menu/toSaveSort',
    method: 'post',
    data: sortList
  })
}

export function fetchAllHighestParentLevelSelections () {
  return request({
    url: '/business/menu/fetchAllHighestParentLevelSelections',
    method: 'get'
  })
}

export function fetchAllSelectionsByPid (menuPid) {
  return request({
    url: '/business/menu/fetchAllSelectionsByPid',
    method: 'post',
    params: menuPid
  })
}

export function countAllSelectionsByPid (menuPid) {
  return request({
    url: '/business/menu/countAllSelectionsByPid',
    method: 'post',
    params: menuPid
  })
}

export function fetchAllMenuList () {
  return request({
    url: '/business/menu/fetchAllMenuList',
    method: 'get'
  })
}

export function fetchList (query) {
  return request({
    url: '/business/menu/fetchMenuByPage',
    method: 'get',
    params: query
  })
}

export function deleteMenu (menuId) {
  return request({
    url: '/business/menu/deleteMenu',
    method: 'post',
    params: { menuId }
  })
}

export function fetchPv (pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createMenu (data) {
  return request({
    url: '/business/menu/createMenu',
    method: 'post',
    data
  })
}

export function updateMenu (data) {
  return request({
    url: '/business/menu/updateMenu',
    method: 'post',
    data
  })
}

export function getAllMenu () {
  return request({
    url: '/business/menu/getAllMenuInLevel',
    method: 'get'
  })
}
/* 根据菜单id查询数据是否重复的操作*/
export function querySysMenuDetailsOne (data) {
  return request({
    url: '/business/sysMenuDetails/querySysMenuDetailsOne',
    method: 'post',
    data: data
  })
}
