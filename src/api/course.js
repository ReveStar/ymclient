import request from '@/utils/request'

export function fetchCourseList() {
  return request({
    url: '/course/all',
    method: 'get'
  })
}

export function searchCourses(data) {
  return request({
    url: '/course/info',
    method: 'get',
    params: data
  })
}
