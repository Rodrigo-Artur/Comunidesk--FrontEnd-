import axios from 'axios';
// MUDANÇA CRÍTICA: Já não precisamos de importar o useAuthStore aqui.
// Isto quebra a dependência circular.
// import { useAuthStore } from '@/store/auth'; 

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Esta é a função "mágica" (Interceptor).
 * Ela agora lê o token DIRETAMENTE do localStorage.
 */
export const setupAxiosInterceptors = () => {
  apiClient.interceptors.request.use(
    (config) => {
      // --- A CORREÇÃO ESTÁ AQUI ---
      // Antes (Problemático):
      // const authStore = useAuthStore();
      // const token = authStore.token;
      
      // Agora (Robusto):
      // Lemos o token diretamente do localStorage a cada chamada.
      const token = localStorage.getItem('token');
      // --- FIM DA CORREÇÃO ---
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // O interceptor de resposta (Bónus)
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Se o token for inválido/expirado, limpamos o localStorage
        // e recarregamos a página (o que força o logout).
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload(); 
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;