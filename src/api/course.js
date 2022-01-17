import request from '@/utils/request'

export function fetchCourseList() {
  return request({
    url: '/course/all',
    method: 'get'
  })
}
