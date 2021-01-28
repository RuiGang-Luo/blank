import request from '@/utils/request'

// 查询任务执行器
export function deskList(query) {
  return request({
    url: '/jobinfo/list',
    method: 'get',
    params: query
  })
}

export function turnon(data) {
  return request({
    url: '/jobinfo/turnon',
    method: 'post',
    data: data
  })
}

export function turnoff(data) {
  return request({
    url: '/jobinfo/turnoff',
    method: 'post',
    data: data
  })
}

// 新增任务
export function addJobInfo(data) {
  return request({
    url: '/jobinfo/add',
    method: 'post',
    data: data
  })
}

export function updateJobInfo(data) {
  return request({
    url: '/jobinfo/update',
    method: 'post',
    data: data
  })
}


export function delJobInfo(id) {
  return request({
    url: '/jobinfo/remove/' + id,
    method: 'get',
  })
}

