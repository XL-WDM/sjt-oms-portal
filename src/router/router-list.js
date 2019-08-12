import _import from './_import'

const homePage = {
  path: '/',
  redirect: '/order/logistics-manage',
  name: 'index',
  component: _import('layout/MainLayout'),
  meta: {},
  children: [
    /*
    {
      path: 'index',
      name: Math.random(),
      component: _import('Index'),
      meta: {
        title: '首页',
        icon: 'ios-apps'
      }
    }
    */
  ]
}

const routeList = [
  homePage,
  {
    path: '/order',
    redirect: '/order/logistics-manage',
    name: Math.random(),
    component: _import('layout/MainLayout'),
    meta: {
      title: '订单管理',
      icon: 'ios-apps'
    },
    children: [
      {
        path: 'logistics-manage',
        name: Math.random(),
        component: _import('order-manage/LogisticsManage'),
        meta: {
          title: '订单管理',
          icon: 'ios-apps'
        }
      }
    ]
  }
]

export default routeList
