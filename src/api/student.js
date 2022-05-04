import request from '@/utils/request'

export function fetchStudentsList(data) {
  return request({
    url: '/student/info',
    method: 'get',
    params: data
  })
}

export function searchStudent(data) {
  return request({
    url: 'student/info',
    method: 'get',
    params: data
  })
}
