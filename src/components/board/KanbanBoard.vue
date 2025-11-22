<template>
  <div class="board-container">
    <div v-if="boardStore.isLoading" class="loading-spinner">
      Carregando posts...
    </div>
    
    <div class="board" v-else-if="boardStore.categories && boardStore.categories.length">
      <!-- 
         O :key DEVE ser único. category.id é o ideal.
         Passamos :category="category". Isso deve bater com o defineProps no filho.
      -->
      <BoardColumn
        v-for="category in boardStore.categories"
        :key="category.id"
        :category="category"
        @edit-post="onEdit"
        @delete-post="onDelete"
      />
    </div>
    
    <div v-else class="empty-state">
        Nenhuma categoria encontrada ou erro ao carregar.
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
  // boardStore.fetchPosts(); // Já chamado no DashboardView
});

const onEdit = (post) => {
  emit('edit-post', post);
};

const onDelete = (postId) => {
  emit('delete-post', postId);
};
</script>

<style scoped>
.board-container {
  flex-grow: 1;
  width: 100%;
  height: 100%;
}
.board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  background-color: #f4f7f6;
  height: 100%;
  align-items: flex-start;
}
.loading-spinner, .empty-state {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #555;
}
</style>