import request from '@/utils/request'

export function fetchStudentsList() {
  return request({
    url: '/student/all',
    method: 'get'
  })
}

export function updateStudent(data) {
  return request(
    {
      url: '/student/update',
      method: 'post',
      data
    }
  )
}

export function createStudent(data) {
  return request({
    url: '/student/add',
    method: 'post',
    data
  })
}

export function deleteStudent(data) {
  return request({
    url: '/student/delete',
    method: 'post',
    data
  })
}

export function searchStudent(data) {
  return request({
    url: 'student/info',
    method: 'get',
    params: data
  })
}
