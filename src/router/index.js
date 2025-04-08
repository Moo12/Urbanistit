import { createRouter, createWebHistory } from 'vue-router'
import getUser from '@/composables/getUser'

import Home from '../views/Home.vue'
import Login from '@/views/auth/Login.vue'
import UploadImageWrapper from '@/views/UploadImageWrapper.vue'
import BlogPage from '@/views/BlogPage.vue'
import BlogItem from '@/views/BlogItem.vue' 
import AdminLayout from '@/views/AdminLayout.vue'
import ContentEditor from '@/components/admin/ContentEditor.vue'
import AllContentPage from '@/components/admin/AllContentPage.vue'
import ClientPage from '@/views/ClientPage.vue'
import ClientsPage from '@/views/ClientsPage.vue'
import ComingSoon from '@/views/ComingSoon.vue'

const { user } = getUser()


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },  
  {
    path: '/uploadimage',
    name: 'uploadimage',
    component: UploadImageWrapper
  },
  {
    path: '/store',
    name: 'Store',
    component: ComingSoon,
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPage,
  },
  {
    path: '/blog/:id',
    name: 'Single-Blog',
    component: BlogItem,
    props: true // Allows passing `id` as a prop to `BlogItem`
  },
  {
    path: '/client/:id',
    name: 'Client',
    component: ClientPage,
    props: true
  },
  {
    path: '/clients',
    name: 'ClientsPage',
    component: ClientsPage,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout, // The layout that includes the sidebar
    meta: { requiresAuth: true },
    children: [
      {
        path: "edit-page/:id",
        name: "edit-page",
        component: AllContentPage,
         props: route => ({
           id: route.params.id,
           name: route.query.name,
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


// **Navigation Guard**
router.beforeEach((to, from, next) => {
  console.log('beforeEach')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const _user = user.value
  console.log( 'user', _user)

  if (requiresAuth && !_user) {
    next('/login'); // Redirect to login if not authenticated
  } else if (to.path === '/login' && _user) {
    next('/admin'); // Redirect logged-in users away from login page
  } else {
    next(); // Allow navigation
  }
});


export default router
