import apiClient from './ApiService';
// MUDANÇA: Já não precisamos de importar o mockAPI
// import { mockAPI } from './api.mock.js';

// MUDANÇA CRÍTICA: Este é o interruptor principal.
// Ao definir como 'false', estamos a "virar a chave" 
// do modo 'Mock' para o modo 'Backend Real'.
const USE_MOCKS = false;

const AuthService = {
  
  login(credentials) {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.login(credentials);
    }
    // MUDANÇA: Agora, apenas esta linha será executada.
    // O apiClient é o 'ApiService.js' (Arquivo 1).
    // O Guia da API (Secção 3.2) confirma que o endpoint é /api/auth/login
    return apiClient.post('/auth/login', credentials);
  },

  register(userData) {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.register(userData);
    }
    // MUDANÇA: Agora, apenas esta linha será executada.
    // O Guia da API (Secção 3.1) confirma que o endpoint é /api/auth/register
    return apiClient.post('/auth/register', userData);
  }
};

export default AuthService;