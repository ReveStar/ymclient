import request from '@/utils/request'

export function fetchCourseList(data) {
  return request({
    url: '/course/all',
    method: 'get',
    params: data
  })
}

export function searchCourses(data) {
  return request({
    url: '/course/info',
    method: 'get',
    params: data
  })
}

export function createCourse(data) {
  return request({
    url: '/course/add',
    method: 'post',
    data
  })
}

export function deleteCourse(data) {
  return request({
    url: '/course/delete',
    method: 'post',
    data
  })
}

export function updateCourse(data) {
  return request(
    {
      url: '/course/update',
      method: 'post',
      data
    }
  )
}
