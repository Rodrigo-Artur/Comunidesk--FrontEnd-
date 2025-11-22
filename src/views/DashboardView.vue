<template>
  <div class="dashboard">
    
    <KanbanBoard 
      v-if="boardStore.categories"
      @edit-post="handleEditPost"
      @delete-post="handleDeletePost"
      @view-post="handleViewPost"
    />
    
    <!-- Modal de Criar/Editar -->
    <PostForm
      v-if="isModalOpen"
      :post-to-edit="currentPost"
      @close="closeModal"
      @post-saved="onPostSaved"
    />

    <!-- NOVO: Modal de Detalhes -->
    <PostDetailsModal
      v-if="viewPostData"
      :post="viewPostData"
      @close="closeViewModal"
    />

    <button class="btn-floating-add" @click="openCreateModal" title="Criar Novo Post">
      +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import KanbanBoard from '@/components/board/KanbanBoard.vue';
import PostForm from '@/components/forms/PostForm.vue';
// Importa o novo componente
import PostDetailsModal from '@/components/board/PostDetailsModal.vue';
import { useBoardStore } from '@/store/board';

const boardStore = useBoardStore();
const isModalOpen = ref(false);
const currentPost = ref(null);

// Estado para o modal de visualização
const viewPostData = ref(null);

onMounted(() => {
  boardStore.fetchPosts();
});

const openCreateModal = () => {
  currentPost.value = null; 
  isModalOpen.value = true;
};

const handleEditPost = (post) => {
  currentPost.value = post;
  isModalOpen.value = true;
};

// Função chamada ao clicar no cartão
const handleViewPost = (post) => {
  viewPostData.value = post;
};

// Fecha o modal de visualização
const closeViewModal = () => {
  viewPostData.value = null;
};

const handleDeletePost = async (postId) => {
  if (window.confirm("Tem a certeza que deseja excluir este post?")) {
    try {
      await boardStore.deletePost(postId);
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  currentPost.value = null;
};

const onPostSaved = async () => {
  closeModal();
  await boardStore.fetchPosts();
};
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: calc(100vh - 60px); 
  position: relative;
}

.btn-floating-add {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1;
  z-index: 100;
  transition: transform 0.2s ease-out;
}

.btn-floating-add:hover {
  transform: scale(1.05);
  background-color: #218838;
}
</style>