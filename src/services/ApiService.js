import axios from 'axios';
// IMPORTANTE: Não importamos useAuthStore aqui para evitar erros de inicialização cíclica

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupAxiosInterceptors = () => {
  apiClient.interceptors.request.use(
    (config) => {
      // CORREÇÃO: Ler diretamente do localStorage.
      // Isso funciona sempre, mesmo que o Pinia ainda não esteja pronto.
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // Se der erro 401 (Não autorizado/Token expirado)
      if (error.response && error.response.status === 401) {
        // Limpa os dados
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Força recarregamento para ir para login
        window.location.reload(); 
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;