// import apiClient from './ApiService'; // <-- REMOVIDO (CAUSA DO CICLO)
import axios from 'axios'; // <-- ADICIONADO

// Criar uma instância separada do Axios SÓ para autenticação.
// Não precisa de interceptores de token.
const authApiClient = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthService = {
  login(credentials) {
    // return apiClient.post('/auth/login', credentials); // <-- Alterado
    return authApiClient.post('/auth/login', credentials); // <-- Corrigido
  },
  
  register(userData) {
    // return apiClient.post('/auth/register', userData); // <-- Alterado
    return authApiClient.post('/auth/register', userData); // <-- Corrigido
  }
};

export default AuthService;