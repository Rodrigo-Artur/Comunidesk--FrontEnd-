import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
// <-- MUDANÇA 1: Importar o componente RegisterView
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true } // Esta rota precisa de login
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true } // Usuário logado não deve ver o login
  },
  // <-- MUDANÇA 2: Adicionar o objeto da rota de registo
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true } // Usuário logado também não deve ver o registo
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard (guarda de navegação)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Se a rota exige auth e não está logado, vai pro login
    next({ name: 'Login' });
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Se a rota é para visitantes e está logado, vai pro dashboard
    next({ name: 'Dashboard' });
  } else {
    // Caso contrário, permite a navegação
    next();
  }
});

export default router;