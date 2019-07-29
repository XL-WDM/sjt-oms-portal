import Vue from 'vue'
import Router from 'vue-router'
import _import from './_import'
import routeList from './router-list'

Vue.use(Router)

const baseRoutes = [
  {
    path: '/404',
    name: 'Error404',
    component: _import('error/404'),
    meta: {
      title: 'error404'
    }
  }
]

const routes = baseRoutes.concat(routeList)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
