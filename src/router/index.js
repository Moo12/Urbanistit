import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import UploadImage from '@/views/UploadImage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },  
  {
    path: '/uploadimage',
    name: 'uploadimage',
    component: UploadImage
  },  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
