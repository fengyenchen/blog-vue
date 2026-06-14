import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/frontend/HomeView.vue'
import LoginView from '../views/admin/LoginView.vue'
import PostView from '../views/frontend/PostView.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import EditorView from '../views/admin/EditorView.vue'
import Dashboard from '../views/admin/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostView,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
        path: '/admin/login',
        name: 'admin-login',
        component: AdminLoginView,
    },
    {
        path: '/edit',
        name: 'edit',
        component: EditorView,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
    },
  ],
})

export default router