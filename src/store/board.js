import { defineStore } from 'pinia';
import PostService from '@/services/PostService'; // O Arquivo 3 (ligado ao backend real)

// --- MUDANÇA CRÍTICA: CATEGORIAS (baseado no log de erro do VS Code) ---
// O seu log de erro do backend (WARN) foi explícito e disse
// que o backend SÓ aceita estes valores:
// [Achados_Perdidos, Dicas_Recomendações, Eventos, Trocas_Doações, Aviso_Gerais]
//
// O 'Guia da API' (que dizia 'AVISO', 'ARTIGO') estava desatualizado.
// Nós DEVEMOS usar os valores exatos do log de erro.
const CATEGORIAS_FIXAS = [
  { id: 'Aviso_Gerais', title: 'Avisos Gerais', posts: [] },
  { id: 'Eventos', title: 'Eventos', posts: [] },
  { id: 'Trocas_Doações', title: 'Trocas/Doações', posts: [] },
  { id: 'Achados_Perdidos', title: 'Achados e Perdidos', posts: [] },
  { id: 'Dicas_Recomendações', title: 'Dicas e Recomendações', posts: [] },
  // O 'ARTIGO' não estava na lista de erro do backend, então o removemos.
];

export const useBoardStore = defineStore('board', {
  state: () => ({
    categories: [],
    isLoading: false,
    // Armazena todos os posts numa "lookup table" para fácil acesso
    postsLookup: new Map(), 
  }),
  actions: {
    async fetchPosts() {
      this.isLoading = true;
      this.postsLookup.clear(); // Limpa o lookup
      try {
        const response = await PostService.getAllPosts(); // Chama o Arquivo 3
        
        // Reinicia as categorias para um estado "limpo"
        const newCategories = JSON.parse(JSON.stringify(CATEGORIAS_FIXAS));
        
        // Distribui os posts vindos do backend nas colunas corretas
        response.data.forEach(post => {
          // 1. Armazena o post no Map() para fácil acesso
          this.postsLookup.set(post.id, post); 
          
          // 2. Encontra a categoria correta (Ex: "Aviso_Gerais")
          const category = newCategories.find(c => c.id === post.category);
          if (category) {
            category.posts.push(post);
          } else {
            console.warn(`Post ${post.id} tem categoria desconhecida: ${post.category}`);
          }
        });
        
        this.categories = newCategories;
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Ação de Drag-and-Drop
    async movePost(postId, newCategory) {
      // 1. Encontrar o post na nossa "lookup table"
      const postToMove = this.postsLookup.get(postId);
      
      if (!postToMove || postToMove.category === newCategory) {
        return; // Post não encontrado ou não mudou de categoria
      }
      
      const oldCategory = postToMove.category;

      // 2. Criar o payload para a API (Conforme Guia 4.4)
      const updateData = {
        title: postToMove.title,
        description: postToMove.description,
        category: newCategory, // A nova categoria (ex: "Aviso_Gerais")
        tags: postToMove.tags || []
      };

      try {
        // 3. Atualização Otimista (move na UI primeiro)
        const oldCat = this.categories.find(c => c.id === oldCategory);
        if (oldCat) {
          oldCat.posts = oldCat.posts.filter(p => p.id !== postId);
        }
        
        const newCat = this.categories.find(c => c.id === newCategory);
        postToMove.category = newCategory; // Atualiza o objeto do post
        if (newCat) {
          newCat.posts.push(postToMove);
        }
        this.postsLookup.set(postId, postToMove);

        // 4. Informa o backend em segundo plano
        await PostService.updatePost(postId, updateData);
        
      } catch (error) {
        console.error(`Erro ao mover o post ${postId}:`, error);
        // Se a API falhar, reverte a UI
        await this.fetchPosts();
      }
    },

    // Ação de Excluir
    async deletePost(postId) {
      try {
        await PostService.deletePost(postId); // Chama o Arquivo 3
        
        // Sucesso na API! Remove o post da UI localmente.
        this.postsLookup.delete(postId); // Remove da lookup
        
        for (const category of this.categories) {
          const index = category.posts.findIndex(p => p.id === postId);
          if (index !== -1) {
            category.posts.splice(index, 1); // Remove o item do array
            break; 
          }
        }
      } catch (error) {
        console.error(`Erro ao excluir o post ${postId}:`, error);
        await this.fetchPosts();
      }
    }
  },
});