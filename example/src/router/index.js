import Vue from 'vue'
import Router from 'vue-router'
import autoRegisterRoutes from './autoRegister';
import Layout from '../Layout.vue';

Vue.use(Router)

export const routes = [
  {
    path: "/",
    redirect: "/demo/virtual",
  },
  {
    name: 'demo',
    path: '/demo',
    component: Layout,
    children: autoRegisterRoutes
  },
]

export default new Router({
  routes,
})