 /* eslint-disable */

import { defineStore } from 'pinia';
import AuthService from '@/services/AuthService';
import apiClient from '@/services/ApiService'; // Importamos o apiClient para o caso de o token expirar

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // O estado inicial vem do localStorage, se existir
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    // A NavBar e o Router usam isto para saber se estamos logados
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await AuthService.login(credentials); // Chama o Arquivo 2 (que chama o backend real)
        
        // --- MUDANÇA CRÍTICA: TRADUÇÃO DA RESPOSTA ---
        // Antes (Mock): const { token, user } = response.data;
        
        // Agora (Backend Real, conforme Guia 3.3):
        // Recebemos a resposta "plana" do backend.
        const { token, id, nome, email } = response.data;
        
        // 1. Validamos se recebemos o token
        if (!token) {
          throw new Error("Token não recebido do servidor");
        }
        
        // 2. Construímos o objeto 'user' que o nosso frontend espera
        const user = {
          id: id,
          name: nome, // Traduzimos 'nome' (backend) para 'name' (frontend)
          email: email
        };
        // --- FIM DA MUDANÇA ---
        
        // 3. Armazenamos no estado do Pinia
        this.token = token;
        this.user = user;
        
        // 4. Armazenamos no localStorage para persistir o login
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return true; // Sucesso
        
      } catch (error) {
        console.error('Erro na ação de login (authStore):', error);
        // Propaga o erro para o LoginView.vue o poder exibir
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || 'Email ou palavra-passe inválidos');
        }
        throw new Error('Não foi possível conectar ao servidor.');
      }
    },
    
    logout() {
      // Limpa o estado e o localStorage
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // O interceptor do ApiService (Arquivo 1) também usa isto
      // para limpar o header de autorização em futuras chamadas.
    },
  },
});