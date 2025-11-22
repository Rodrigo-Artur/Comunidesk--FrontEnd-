import { defineStore } from 'pinia'
import PostService from '@/services/PostService'

const categoryMap = {
  'AVISOS': 'avisos',
  'EVENTOS': 'eventos',
  'TROCAS': 'trocas',
  'PERDIDOS': 'perdidos',
  'DICAS': 'dicas',
  'ARTIGO': 'avisos'
};

// Função auxiliar para gerar categorias limpas
const getInitialCategories = () => [
  { id: 'avisos', title: 'Avisos Gerais', posts: [] },
  { id: 'eventos', title: 'Eventos', posts: [] },
  { id: 'trocas', title: 'Trocas/Doações', posts: [] },
  { id: 'perdidos', title: 'Achados e Perdidos', posts: [] },
  { id: 'dicas', title: 'Dicas e Recomendações', posts: [] },
];

export const useBoardStore = defineStore('board', {
  state: () => ({
    categories: getInitialCategories(),
    isLoading: false,
  }),
  actions: {
    async fetchPosts() {
      this.isLoading = true;
      try {
        const response = await PostService.getAllPosts();
        
        console.log("Resposta do Backend (fetchPosts):", response);

        // Reinicia as categorias
        const newCategories = getInitialCategories();
        
        const posts = (response && response.data && Array.isArray(response.data)) ? response.data : [];
        
        posts.forEach(post => {
          if (!post) return; // Ignora posts nulos

          const backendCategory = post.category || 'AVISOS'; 
          const targetId = categoryMap[backendCategory];
          
          if (targetId) {
            const category = newCategories.find(c => c.id === targetId);
            
            // AQUI ESTAVA O PERIGO: Se category for undefined, category.posts quebra
            if (category && category.posts) {
              category.posts.push(post);
            } else {
               console.warn(`Categoria alvo encontrada (${targetId}), mas objeto de categoria inválido no frontend.`);
            }
          } else {
            console.warn(`Categoria desconhecida do backend: ${post.category}`);
          }
        });
        
        this.categories = newCategories;

      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        if (error.response && error.response.status === 403) {
             console.error("Autorização falhou (403).");
        }
      } finally {
        this.isLoading = false;
      }
    },
    
    async deletePost(postId) {
        await PostService.deletePost(postId);
        await this.fetchPosts();
    }
  },
});