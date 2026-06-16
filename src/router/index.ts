import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/frontend/HomeView.vue'
import LoginView from '../views/admin/LoginView.vue'
import PostView from '../views/frontend/PostView.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import EditorView from '../views/admin/EditorView.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import EditFormView from '../views/admin/EditFormView.vue'

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
      path: '/editor',
      name: 'editor',
      component: EditorView,
    },
    {
      path: '/editor/edit/:id',
      name: 'EditorPostEdit',
      component: EditFormView,
      props: true
    },
    {
      path: '/editor/edit/new',
      name: 'EditorPostCreate',
      component: EditFormView
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: AdminLoginView,
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: Dashboard,
    },
  ],
})

export default router