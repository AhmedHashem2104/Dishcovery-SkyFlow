import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dishcovery',
      name: 'dishcovery',
      component: () => import('../views/DishCoveryView.vue'),
    },
    {
      path: '/skyflow',
      name: 'skyflow',
      component: () => import('../views/SkyFlowView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/qr-scanner',
      name: 'qr-scanner',
      component: () => import('../views/QRScannerView.vue'),
    },
  ],
})

export default router
