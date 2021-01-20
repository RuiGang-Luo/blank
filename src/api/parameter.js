import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/business/parameter/list',
    method: 'post',
    params: query
  })
}
export function DownLoadParameters (fileName, sheetName, parameterData) {
  return request({
    url: '/business/parameter/getDownLoad',
    method: 'post',
    responseType: 'blob',
    params: { fileName, sheetName },
    data: parameterData
  })
}

export function getInterface () {
  return request({
    url: '/business/parameter/getInterfaceDetails',
    method: 'post'
  })
}
export function getparameterScopeOption (data) {
  return request({
    url: '/business/parameter/getparameterScopeOption',
    method: 'post',
    params: data
  })
}

export function createArticle (data) {
  return request({
    url: '/business/parameter/create',
    method: 'post',
    params: data
  })
}
export function deleteArticle (data) {
  return request({
    url: '/business/parameter/delete',
    method: 'post',
    params: data
  })
}
export function getDropDownBoxValue (data) {
  return request({
    url: '/business/dict/getDropDownBoxValue',
    method: 'post',
    params: data
  })
}
export function updateArticle (data) {
  return request({
    url: '/business/parameter/update',
    method: 'post',
    params: data
  })
}
