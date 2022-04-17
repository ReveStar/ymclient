import request from '@/utils/request'

export function fetchSubjectList() {
  return request({
    url: '/subject/info',
    method: 'get'
  })
}

export function searchSubjects(data) {
  return request({
    url: '/subject/info',
    method: 'get',
    params: data
  })
}

