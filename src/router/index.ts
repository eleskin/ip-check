import AppHome from '@/views/AppHome.vue'
import AppDetails from '@/views/AppDetails.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppHome
    },
    {
      path: '/:query',
      name: 'details',
      component: AppDetails
    }
  ]
})

export default router
