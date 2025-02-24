import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import UploadImage from '@/views/UploadImage.vue'
import BlogPage from '@/views/BlogPage.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import ContentEditor from '@/components/admin/ContentEditor.vue'
import ListEditorTest from '@/components/admin/ListEditorTest.vue'

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
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPage
  },  
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout, // The layout that includes the sidebar
    children: [
      {
        path: "edit-page/:id",
        name: "edit-page",
        component: ListEditorTest,
         props: route => ({
           section: {
             id: route.params.id,
             name: route.query.name,
           }
         }),
      },
      {
        path: "edit-section/:id",
        name: "edit-section",
        component: ContentEditor,
         props: route => ({
           section: {
             id: route.params.id,
             name: route.query.name,
           }
         }),
      },

      ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
