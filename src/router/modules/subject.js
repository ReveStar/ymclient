import Layout from '@/layout'

const subjectRouter = {
  path: '/subject',
  component: Layout,
  redirect: '/subject/index',
  meta: { roles: ['student'] },
  children: [
    {
      path: 'index',
      component: () => import('@/views/subject/index'),
      name: 'subject',
      meta: { title: '报名', icon: 'table', affix: true }
    }
  ]
}

export default subjectRouter
