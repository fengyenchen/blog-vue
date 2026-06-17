import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/frontend/HomeView.vue'
import LoginView from '../views/admin/LoginView.vue'
import PostView from '../views/frontend/PostView.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import EditorView from '../views/admin/EditorView.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import EditFormView from '../views/admin/EditFormView.vue'
import applyForEditorView from '../views/frontend/ApplyForEditorView.vue'
import EditorSettingsView from '../views/admin/EditorSettingsView.vue'

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
      path: '/applyForEditor',
      name: 'applyForEditor',
      component: applyForEditorView,
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView,
      meta: { 
        requiresAuth: true, 
        roles: ['editor', 'admin']
      }
    },
    {
      path: '/editor/edit/:id',
      name: 'EditorPostEdit',
      component: EditFormView,
      props: true,
      meta: { 
        requiresAuth: true, 
        roles: ['editor', 'admin']
      }
    },
    {
      path: '/editor/edit/new',
      name: 'EditorPostCreate',
      component: EditFormView,
      meta: { 
        requiresAuth: true, 
        roles: ['editor', 'admin']
      }
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
      meta: { 
        requiresAuth: true, 
        roles: ['admin']
      }
    },
    {
      path: '/editor/settings',
      name: 'editorSettings',
      component: EditorSettingsView,
      meta: { 
        requiresAuth: true, 
        roles: ['editor', 'admin']
      }
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = !!localStorage.getItem('token') // 以 token 是否存在來判斷是否已登入，目前使用 user_id 作為憑證
  const userRole = localStorage.getItem('role') // 'admin' 或 'editor'

  // 情況 A：要去需要驗證的頁面（/editor 或 /admin 系列）
  if (requiresAuth) {
    
    // 1. 沒登入（user）
    if (!isAuthenticated) {
      // 依據想闖入的路徑，決定丟去哪一個登入頁
      if (to.path.startsWith('/admin')) {
        next({ name: 'adminLogin' }) // 想進儀表板 -> 丟去管理員登入
      } else {
        next({ name: 'login' })      // 想進編輯區 -> 丟去編輯者登入
      }
    } 
    
    // 2. 有登入（admin 或 editor）
    else {
      const allowedRoles = to.meta.roles as string[] || undefined
      
      // 檢查角色是否符合頁面要求
      if (allowedRoles && allowedRoles.includes(userRole || '')) {
        next() // 權限符合，放行！
      } else {
        // 角色不符合（例如：editor 想看 admin 的儀表板）
        alert('權限不足，無法進入該頁面！')
        
        // 回他原本該待的地方
        if (userRole === 'editor') {
          next({ name: 'editor' })
        } else {
          next({ name: 'home' })
        }
      }
    }
  } 
  
  // 情況 B：已經登入（admin 或 editor），卻又主動跑去任何一個不需要驗證的頁面
  else if ((to.name === 'login' || to.name === 'adminLogin' || to.name === 'applyForEditor' || to.name === 'home') && isAuthenticated) {
    // 強制登出，清空身分，變回一般 user
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    next() 
  }
  
  // 情況 C：去不需要驗證的公開頁面
  // 任何人都可以直接暢行無阻
  else {
    next()
  }
})

export default router