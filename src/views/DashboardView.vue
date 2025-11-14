<template>
  <div class="dashboard">
    
    <!-- 
      MUDANÇA: O cabeçalho <header> que continha "Mural ComuniDesk" 
      e o botão antigo foi completamente removido.
    -->

    <!-- O Quadro Kanban continua a ser o elemento principal -->
    <KanbanBoard 
      @edit-post="handleEditPost"
      @delete-post="handleDeletePost"
    />
    
    <!-- O Modal (invisível até ser ativado) -->
    <PostForm
      v-if="isModalOpen"
      :post-to-edit="currentPost"
      @close="closeModal"
      @post-saved="onPostSaved"
    />

    <!-- 
      MUDANÇA: Adicionado o novo Botão Flutuante
      Ele chama a mesma função @click="openCreateModal"
    -->
    <button class="btn-floating-add" @click="openCreateModal" title="Criar Novo Post">
      +
    </button>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref } from 'vue';
import KanbanBoard from '@/components/board/KanbanBoard.vue';
import PostForm from '@/components/forms/PostForm.vue';
import { useBoardStore } from '@/store/board';

// NENHUMA MUDANÇA AQUI DENTRO!
// A lógica permanece exatamente a mesma.

const boardStore = useBoardStore();
const isModalOpen = ref(false);
const currentPost = ref(null);

const openCreateModal = () => {
  currentPost.value = null; 
  isModalOpen.value = true;
};

const handleEditPost = (post) => {
  currentPost.value = post;
  isModalOpen.value = true;
};

const handleDeletePost = async (postId) => {
  // Adiciona uma confirmação antes de excluir
  if (window.confirm("Tem a certeza que deseja excluir este post?")) {
    try {
      await boardStore.deletePost(postId);
    } catch (error) {
      console.error("Erro ao excluir o post:", error);
    }
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  currentPost.value = null;
};

const onPostSaved = async () => {
  closeModal();
  try {
    await boardStore.fetchPosts();
  } catch (error) {
    console.error("Erro ao buscar posts após salvar:", error);
  }
};
</script>

<style scoped>
.dashboard {
  /* MUDANÇA: Adicionado 'position: relative' para que o botão flutuante 
    (se usássemos position: absolute) ficasse contido aqui.
    Mas para 'position: fixed', ele fica relativo à janela.
    Vamos deixar o .dashboard simples.
  */
  width: 100%;
}

/* MUDANÇA: Os estilos .dashboard-header e .btn-new-post foram removidos.
*/

/* MUDANÇA: Adicionados estilos para o novo Botão Flutuante (FAB)
*/
.btn-floating-add {
  position: fixed; /* Fixa o botão na janela de visualização */
  bottom: 2rem; /* 32px de baixo */
  right: 2rem; /* 32px da direita */
  
  width: 60px;   /* Botão circular */
  height: 60px;
  border-radius: 50%;
  
  background-color: #28a745; /* Verde (o mesmo do botão antigo) */
  color: white;
  
  border: none;
  cursor: pointer;
  
  /* Sombra para dar o efeito "flutuante" */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  /* Centraliza o "+" */
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: 2.5rem; /* Tamanho do "+" */
  font-weight: 300;
  line-height: 1; /* Ajusta o alinhamento vertical do + */
  
  z-index: 100; /* Garante que fica por cima do quadro */
  
  transition: transform 0.2s ease-out;
}

.btn-floating-add:hover {
  transform: scale(1.05); /* Efeito de zoom ao passar o rato */
  background-color: #218838; /* Um pouco mais escuro */
}
</style>