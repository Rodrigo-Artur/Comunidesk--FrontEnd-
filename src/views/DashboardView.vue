<template>
  <div class="dashboard">
    <NavBar />
    <main class="board-container">
      <KanbanBoard
        :columns="boardColumns"
        @edit-post="handleEditPost"
        @delete-post="handleDeletePost"
      />
    </main>

    <button class="fab-create-post" @click="openModal" title="Criar Novo Post">
      +
    </button>

    <PostForm
      v-if="isModalOpen"
      :post-to-edit="postToEdit"
      @close="closeModal"
      @post-saved="onPostSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '@/components/common/NavBar.vue';
import KanbanBoard from '@/components/board/KanbanBoard.vue';
import PostForm from '@/components/forms/PostForm.vue';
import PostService from '@/services/PostService';
import { boardStore } from '@/store/board.js';

const posts = boardStore.posts;
const fetchPosts = boardStore.fetchPosts;

const isModalOpen = ref(false);
const postToEdit = ref(null);

// Mapeia os posts para as colunas do Kanban
const boardColumns = computed(() => {
  const columns = {
    'Aviso_Gerais': { id: 'Aviso_Gerais', name: 'Avisos', posts: [] },
    'Eventos': { id: 'Eventos', name: 'Eventos', posts: [] },
    'Trocas_Doações': { id: 'Trocas_Doações', name: 'Trocas/Doações', posts: [] },
    'Achados_Perdidos': { id: 'Achados_Perdidos', name: 'Achados e Perdidos', posts: [] },
    'Dicas_Recomendações': { id: 'Dicas_Recomendações', name: 'Dicas e Recomendações', posts: [] },
  };

  if (posts.value && Array.isArray(posts.value)) {
    posts.value.forEach(post => {
      // --- MUDANÇA: post.category ---
      if (columns[post.category]) {
        columns[post.category].posts.push(post);
      }
      // --- FIM DA MUDANÇA ---
    });
  }

  return Object.values(columns);
});

// Abre o modal para criar (sem post)
const openModal = () => {
  postToEdit.value = null;
  isModalOpen.value = true;
};

// Fecha o modal e limpa a seleção
const closeModal = () => {
  isModalOpen.value = false;
  postToEdit.value = null;
};

// Chamado quando o PostForm salva (cria ou edita)
const onPostSaved = () => {
  closeModal();
  fetchPosts(); // Atualiza a lista de posts
};

// 1. AÇÃO DE EDITAR
const handleEditPost = (post) => {
  postToEdit.value = post;
  isModalOpen.value = true;
};

// 2. AÇÃO DE EXCLUIR
const handleDeletePost = async (postId) => {
  if (window.confirm('Tem certeza que deseja excluir este post?')) {
    try {
      await PostService.deletePost(postId);
      fetchPosts(); // Atualiza a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir o post:", error);
      alert('Não foi possível excluir o post.');
    }
  }
};

// Carrega os posts quando o componente é montado
onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
/* Estilos Inalterados */
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}
.board-container {
  flex: 1;
  overflow: hidden; 
  background-color: #f9fafb; 
}
.fab-create-post {
  position: fixed; 
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #3b82f6; 
  color: white;
  border: none;
  font-size: 2rem; 
  font-weight: 300;
  line-height: 56px; 
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  z-index: 999; 
}
.fab-create-post:hover {
  background-color: #2563eb; 
  transform: scale(1.05);
}
</style>