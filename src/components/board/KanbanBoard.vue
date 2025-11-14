<template>
  <div class="board-container">
    <div v-if="boardStore.isLoading" class="loading-spinner">
      Carregando posts...
    </div>
    
    <div class="board" v-else>
      
      <!-- 
        MUDANÇA: O comentário foi movido para AQUI (fora da tag).
        Adicionamos os listeners @edit-post e @delete-post
        que chamam as funções 'onEdit' e 'onDelete'
      -->
      <BoardColumn
        v-for="category in boardStore.categories"
        :key="category.id"
        :category="category"
        @edit-post="onEdit"
        @delete-post="onDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useBoardStore } from '@/store/board';
import BoardColumn from './BoardColumn.vue';

const boardStore = useBoardStore();

// eslint-disable-next-line no-undef
const emit = defineEmits(['edit-post', 'delete-post']);

onMounted(() => {
  boardStore.fetchPosts();
});

// Estas funções já não vão dar erro de "não usado"
// porque o template vai compilar corretamente.
const onEdit = (post) => {
  emit('edit-post', post);
};

const onDelete = (postId) => {
  emit('delete-post', postId);
};
</script>

<style scoped>
.board-container {
  flex-grow: 1; /* Ocupa o espaço restante */
  width: 100%;
}
.board {
  display: flex;
  gap: 1rem;
  overflow-x: auto; /* Permite scroll horizontal das colunas */
  padding: 1rem;
  background-color: #f4f7f6;
  min-height: 80vh;
  align-items: flex-start; /* Alinha as colunas no topo */
}
.loading-spinner {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #555;
}
</style>