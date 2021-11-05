import Vue from 'vue'
import Router from 'vue-router'
import autoRegisterRoutes from './autoRegister';
import Layout from '../App.vue';

Vue.use(Router)

export const routes = [
  {
    path: '/demo',
    component: Layout,
    children: [
      ...autoRegisterRoutes
    ]
  },
]

export default new Router({
  routes,
})