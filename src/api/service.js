import request from '@/utils/request'

// 一键解绑服务清单下的服务绑定
export function deleteRelaServiceAndInterface (data) {
  return request({
    url: '/business/service/deleteRelaServiceAndInterface',
    method: 'post',
    params: data
  })
}

// 查询服务清单下是否有绑定服务
export function selectInterfaceById (data) {
  return request({
    url: '/business/service/selectInterfaceById',
    method: 'post',
    params: data
  })
}

// 获取下拉框的码值方法
export function getDropDownBoxValue (reqData) {
  return request({
    url: '/business/dict/getDropDownBoxValue',
    method: 'get',
    params: reqData
  })
}

export function selectByNameAndStatus (query) {
  return request({
    url: '/business/service/selectByNameAndStatus',
    method: 'post',
    params: query
  })
}

export function createService (serviceInfo) {
  return request({
    url: '/business/service/createService',
    method: 'post',
    params: serviceInfo
  })
}
export function updateService (serviceInfo) {
  return request({
    url: '/business/service/updateService',
    method: 'post',
    params: serviceInfo
  })
}

// 修改状态（启用、禁用、删除）
export function modifyStatus (reqData) {
  return request({
    url: '/business/service/updateService',
    method: 'post',
    params: reqData
  })
}
export function deleteService (reqData) {
  return request({
    url: '/business/service/deleteService',
    method: 'post',
    params: reqData
  })
}
/* 将数据导出到excel表格的操作*/
export function downLoadServices (fileName, sheetName, reqData) {
  return request({
    url: '/business/service/getDownLoad',
    method: 'post',
    responseType: 'blob',
    params: { fileName, sheetName },
    data: reqData
  })
}
