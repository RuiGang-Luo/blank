import request from '@/utils/request'

export function getUserJson () {
  return request({
    url: '/static/json/users.json',
    method: 'get'
  })
}

