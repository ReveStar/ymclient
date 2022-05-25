import Layout from '@/layout'

const studentRouter = {
  path: '/student',
  component: Layout,
  redirect: '/student/index',
  meta: { roles: ['student'] },
  children: [
    {
      path: 'index',
      component: () => import('@/views/student/index'),
      name: 'student',
      meta: { title: '课程信息', icon: 'table', affix: true }
    }
  ]
}

export default studentRouter
