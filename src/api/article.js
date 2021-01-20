import request from '@/utils/request'

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
