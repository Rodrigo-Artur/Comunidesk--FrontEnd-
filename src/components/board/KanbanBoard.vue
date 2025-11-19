<template>
  <div class="kanban-board">
    <BoardColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      @edit-post="$emit('edit-post', $event)"
      @delete-post="$emit('delete-post', $event)"
    />
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import BoardColumn from './BoardColumn.vue';

defineProps({
  columns: {
    type: Array,
    required: true,
  },
});

// MUDANÇA: Definimos os eventos que este componente pode emitir
defineEmits(['edit-post', 'delete-post']);
</script>

<style scoped>
.kanban-board {
  display: flex;
  overflow-x: auto;
  padding: 1.5rem 0.5rem;
  height: 100%;
}
</style>