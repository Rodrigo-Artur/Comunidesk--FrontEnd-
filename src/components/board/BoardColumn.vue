<template>
  <div class="column">
    <!-- Proteção: Só renderiza o título se category existir -->
    <h3 class="column-title">{{ category?.title || 'Sem Título' }}</h3>
    
    <draggable
      class="kanban-list"
      :list="category?.posts || []"
      group="posts"
      itemKey="id"
      @change="onDragChange"
      :data-category-id="category?.id"
    >
      <template #item="{ element: post }">
        <PostCard 
          v-if="post"
          :post="post" 
          @edit="onEditPost"
          @delete="onDeletePost"
        />
      </template>
    </draggable>
    
  </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import PostCard from './PostCard.vue';
import { useBoardStore } from '@/store/board';

// eslint-disable-next-line no-undef
const props = defineProps({
  // O nome da prop aqui TEM de bater com o que é passado no KanbanBoard (:category="...")
  category: {
    type: Object,
    required: true,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['edit-post', 'delete-post']);

// eslint-disable-next-line no-unused-vars
const boardStore = useBoardStore();

const onDragChange = (event) => {
  if (event.added) {
    const postId = event.added.element.id;
    const newCategory = props.category.id;
    console.log(`Post ${postId} movido para ${newCategory}`);
    // boardStore.movePost(...) // Futura implementação
  }
}

const onEditPost = (post) => {
  emit('edit-post', post);
};

const onDeletePost = (postId) => {
  emit('delete-post', postId);
};
</script>

<style scoped>
.column {
  flex: 0 0 300px;
  background-color: #e9e9e9;
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.column-title {
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ccc;
}
.kanban-list {
  min-height: 150px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto; /* Permite scroll dentro da coluna se tiver muitos posts */
}
</style>