import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/router/user.js'
import Layout from '@/router/layout.js'

Vue.use(VueRouter)
// 路由表
const routes = [
  ...Login,
  ...Layout,
]

const router = new VueRouter({
  routes
})

export default router
