import { defineStore } from 'pinia'
import AuthService from '@/services/AuthService'

// IMPORTANTE: 'export const' é fundamental para que o App.vue consiga importar.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await AuthService.login(credentials);
        const token = response.data.token || response.data.accessToken;
        
        // Garante que temos um objeto de usuário, mesmo que básico
        const user = response.data.user || {
            id: 'temp-id',
            name: 'Usuário', 
            email: credentials.email
        };

        if (token) {
            this.token = token;
            this.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        }
        return false;

      } catch (error) {
        console.error('Erro no login:', error);
        throw new Error(error.response?.data?.message || 'Falha na autenticação');
      }
    },
    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // O redirecionamento é feito pelo componente que chama (ex: NavBar)
    },
  },
});