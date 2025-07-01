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
    component: UploadImageWrapper,
    meta: { navbarLayout: 'stacked' }
  },
  {
    path: '/store',
    name: 'Store',
    component: ComingSoon,
    meta: { navbarLayout: 'stacked' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogPage,
    meta: { navbarLayout: 'fixed' }
  },
  {
    path: '/blog/:id',
    name: 'Single-Blog',
    component: BlogItem,
    props: true,
    meta: { navbarLayout: 'stacked' }
  },
  {
    path: '/client/:id',
    name: 'Client',
    component: ClientPage,
    meta: { navbarLayout: 'stacked' }
  },
  {
    path: '/clients',
    name: 'ClientsPage',
    component: ClientsPage,
    props: true,
    meta: { navbarLayout: 'stacked' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { navbarLayout: 'stacked' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    meta: { requiresAuth: true, navbarLayout: 'stacked' },
    children: [
      {
        path: "edit-page/:id",
        name: "edit-page",
        component: AllContentPage,
         props: route => ({
           id: route.params.id,
           name: route.query.name,
         }),
         meta: { navbarLayout: 'stacked' }
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
         meta: { navbarLayout: 'stacked' }
      },
      ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
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
