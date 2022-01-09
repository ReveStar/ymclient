import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token, account_id) {
  return request({
    url: '/user/info',
    method: 'get',
    headers: { 'X-Token': token },
    params: {
      account_id
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
