import Layout from '@/layout'

const courseRouter = {
  path: '/course',
  component: Layout,
  redirect: '/course/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/course/index'),
      name: 'course',
      meta: { title: 'Course', icon: 'table', affix: true }
    }
  ]
}

export default courseRouter
