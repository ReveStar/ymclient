import request from '@/utils/request'

export function getInfoByCode(data) {
  return request({
    url: '/wx/code',
    method: 'post',
    data,
    baseURL: 'api/client'
  })
}
