import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/frontend/HomeView.vue'
import LoginView from '../views/admin/LoginView.vue'
import PostView from '../views/frontend/PostView.vue'

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
  ],
})

export default router