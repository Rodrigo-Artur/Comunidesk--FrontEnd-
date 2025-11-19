import { ref } from 'vue';
import PostService from '@/services/PostService';
// import { authState } from './auth'; // <-- REMOVIDA (Esta era a causa do ciclo)

// Estado reativo para os posts
const posts = ref([]);

// Função para buscar posts
const fetchPosts = async () => {
  // --- VERIFICAÇÃO REMOVIDA ---
  // A verificação 'if (!authState.value.isAuthenticated)' foi removida
  // para quebrar o ciclo de dependência.

  try {
    // O ApiService.js (usado pelo PostService) já adiciona o token.
    // Se o token for inválido, o backend rejeitará a chamada.
    const response = await PostService.getAllPosts();
    posts.value = response.data; 
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    posts.value = []; // Limpa os posts em caso de erro

    // --- LÓGICA DE SEGURANÇA ADICIONADA ---
    // Se o erro for 401 (Não Autorizado) ou 403 (Proibido),
    // o token é inválido ou expirou, então fazemos logout.
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Autorização falhou. A fazer logout.');
      // Importamos dinamicamente o auth.js APENAS aqui
      const { logout } = await import('./auth.js');
      logout();
    }
  }
};

// Exportamos o estado e as ações como um objeto
export const boardStore = {
  posts,
  fetchPosts,
};