import _import from './_import'

const homePage = {
  path: '/',
  redirect: '/index',
  name: 'index',
  component: _import('layout/MainLayout'),
  meta: {
  },
  children: [
    {
      path: 'index',
      name: Math.random(),
      component: _import('Index'),
      meta: {
        title: '首页',
        icon: 'ios-apps'
      }
    }
  ]
}

const routeList = [
  homePage,
  {
    path: '/product',
    redirect: '/product/product-list',
    name: Math.random(),
    component: _import('layout/MainLayout'),
    meta: {
      title: '商品管理',
      icon: 'ios-apps'
    },
    children: [
      {
        path: 'product-list',
        name: Math.random(),
        component: _import('product/ProductList'),
        meta: {
          title: '商品列表',
          icon: 'ios-apps'
        }
      },
      {
        path: 'add-product',
        name: Math.random(),
        component: _import('Login'),
        meta: {
          title: '新增商品',
          icon: 'ios-apps'
        }
      }
    ]
  },
  {
    path: '/product1',
    redirect: '/product1/product-list',
    name: Math.random(),
    component: _import('layout/MainLayout'),
    meta: {
      title: '商品管理',
      icon: 'ios-apps'
    },
    children: [
      {
        path: 'product-list',
        name: Math.random(),
        component: _import('product/ProductList'),
        meta: {
          title: '商品列表',
          icon: 'ios-apps'
        }
      },
      {
        path: 'add-product',
        name: Math.random(),
        component: _import('Login'),
        meta: {
          title: '新增商品',
          icon: 'ios-apps'
        }
      }
    ]
  }
]

export default routeList
