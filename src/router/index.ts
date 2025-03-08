import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/Demo.vue')
    },
    {
      path: '/post-norm-test',
      name: 'postNormTest',
      component: () => import('../views/PostNormTest.vue')
    },
    {
      path: '/post-repost-test',
      name: 'postRePostTest',
      component: () => import('../views/PostRePostTest.vue')
    },
    {
      path: '/info/:accountId',
      name: 'userInfo',
      component: () => import('../views/MyInfo.vue')
    }
  ]
})

export default router 