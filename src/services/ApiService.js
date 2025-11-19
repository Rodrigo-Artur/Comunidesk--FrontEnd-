import axios from 'axios';
// import { authState } from '@/store/auth'; // <-- REMOVIDO para quebrar o ciclo estático

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // A tua porta do backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT a CADA requisição
apiClient.interceptors.request.use(
  async (config) => {
    // --- CORREÇÃO ---
    // Importamos o store dinamicamente (APENAS quando necessário)
    // Isso não cria um ciclo de dependência na inicialização.
    const { authState } = await import('@/store/auth.js');
    
    const token = authState.value.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// O interceptor de resposta (para 401/logout) foi removido
// porque ele completava o ciclo de dependência.

export default apiClient;