import request from '@/utils/request'

// 查询任务执行器
export function deskList(query) {
  return request({
    url: '/business/vcenter/list',
    method: 'get',
    params: query
  })
}

export function turnon(data) {
  return request({
    url: '/business/vcenter/power/start',
    method: 'post',
    data: data
  })
}

export function turnoff(data) {
  return request({
    url: '/business/vcenter/power/stop',
    method: 'post',
    data: data
  })
}

// 新增任务
export function addJobInfo(data) {
  return request({
    url: '/business/vcenter/job/insert',
    method: 'post',
    data: {...data,"primaryKey" : new Date().getTime()}
  })
}

// export function updateJobInfo(data) {
//   return request({
//     url: '/business/vcenter/jobinfo/update',
//     method: 'post',
//     data: data
//   })
// }
//
//
// export function delJobInfo(id) {
//   return request({
//     url: '/business/vcenter/jobinfo/remove/' + id,
//     method: 'get',
//   })
// }

