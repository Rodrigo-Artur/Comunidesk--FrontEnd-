<template>
  <div class="board-column">
    <h3 class="column-title">{{ column.name }}</h3>
    <div class="column-content">
      
      <!-- 
        --- MUDANÇA ---
        Removemos o componente <draggable> e substituímo-lo
        por um <div> com um loop v-for.
        Isto remove a funcionalidade de arrastar.
      -->
      <div class="post-list">
        <PostCard
          v-for="post in column.posts"
          :key="post.id"
          :post="post"
          @edit-post="$emit('edit-post', post)"
          @delete-post="$emit('delete-post', post.id)"
        />
      </div>
      <!-- --- FIM DA MUDANÇA --- -->

    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */

// --- MUDANÇA ---
// Removemos a importação do 'vuedraggable'
// import draggable from 'vuedraggable'; 
// --- FIM DA MUDANÇA ---

import PostCard from './PostCard.vue';

defineProps({
  column: {
    type: Object,
    required: true,
  },
});

// Os eventos continuam a ser emitidos, sem alterações
defineEmits(['edit-post', 'delete-post']);
</script>

<style scoped>
.board-column {
  flex: 1;
  min-width: 280px;
  background-color: #f4f5f7;
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0 0.5rem;
}
.column-title {
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  color: #4b5563;
}
.column-content {
  padding: 0 0.5rem;
  height: calc(100% - 40px);
  overflow-y: auto;
}

/* --- MUDANÇA ---
  A classe .drag-area foi renomeada para .post-list
  e o min-height foi removido, pois já não é necessário
  para o drag-and-drop.
*/
.post-list {
  /* min-height: 100px; */
}
</style>