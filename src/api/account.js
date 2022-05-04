import request from '@/utils/request'

export function sendPhoneCode(data) {
  return request({
    url: 'account/code',
    method: 'post',
    data
  })
}

export function registerAccount(data) {
  return request({
    url: 'account/register',
    method: 'post',
    data
  })
}
