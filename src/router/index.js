import { createRouter, createWebHistory } from 'vue-router'
// --- REMOVER TODAS AS IMPORTAÇÕES ESTÁTICAS DE VIEWS ---
// import DashboardView from '../views/DashboardView.vue'
// import LoginView from '../views/LoginView.vue'
// import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // Usar importação dinâmica (lazy-loading)
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    // --- CORREÇÃO ---
    // Usar importação dinâmica (lazy-loading)
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    // --- CORREÇÃO ---
    // Usar importação dinâmica (lazy-loading)
    component: () => import('../views/RegisterView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // A sua lógica de guarda (verificando o localStorage) está correta
  // e não causa o ciclo.
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
})

export default router