import request from '@/utils/request'

export function fetchStudentList() {
  return request({
    url: '/student/all',
    method: 'get'
  })
}
