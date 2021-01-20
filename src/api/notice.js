import request from '@/utils/request'

export function getDropDownBoxValue (data) {
  return request({
    url: '/business/dict/getDropDownBoxValue',
    method: 'post',
    params: data
  })
}
export function getscopeOptions (data) {
  return request({
    url: '/business/org/listoptions',
    method: 'post',
    data: data
  })
}
export function getNoticeList (data) {
  return request({
    url: '/business/notice/getNoticeList',
    method: 'post',
    params: data
  })
}
export function createNotice (data) {
  return request({
    url: '/business/notice/createNotice',
    method: 'post',
    params: data
  })
}
export function updateNotice (data) {
  return request({
    url: '/business/notice/updateNotice',
    method: 'post',
    params: data
  })
}
/* 删除数据操作*/
export function deleteNotice (data) {
  return request({
    url: '/business/notice/deleteNotice',
    method: 'post',
    params: data
  })
}
/* 查询所有机构列表在字典表中的数据操作*/
export function querySysData (tableName, column) {
  return request({
    url: '/business/dict/getDropDownBoxValue',
    method: 'post',
    params: { tableName, column }
  })
}
