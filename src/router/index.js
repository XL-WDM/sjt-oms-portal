import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import _import from './_import'
import routeList from './router-list'

Vue.use(Router)

const baseRoutes = [
  {
    path: '/404',
    name: Math.random(),
    component: _import('error/404'),
    meta: {
      title: 'error404'
    }
  },
  {
    path: '/sign',
    name: Math.random(),
    component: _import('Login'),
    meta: {
      title: '登陆'
    }
  },
  {
    path: '/',
    name: Math.random(),
    redirect: '/order/logistics-manage',
    meta: {
      title: '登陆'
    }
  }
]

const routes = baseRoutes.concat(routeList)

const router = new Router({
  mode: process.env.ENV === 'production' ? 'hash' : 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (!VueCookies.isKey('SESSION') && to.fullPath !== '/sign') {
    next('/sign')
  }
  next()
})

export default router
