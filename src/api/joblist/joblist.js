import request from '@/utils/request'

// 查询任务执行器
export function getJoblist(query) {
  return request({
    url: '/business/vcenter/job/list',
    method: 'get',
    params: query
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
    url: '/business/vcenter/job/update',
    method: 'post',
    data: data
  })
}


export function delJobInfo(id) {
  return request({
    url: '/business/vcenter/job/delete/' + id,
    method: 'delete',
  })
}

