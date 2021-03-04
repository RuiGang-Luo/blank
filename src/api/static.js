import request from '@/utils/request'

export function getUserJson () {
  return request({
    url: '/resource/json/users.json',
    method: 'get'
  })
}

