<template>
  <div class="column">
    <!-- Título da Coluna -->
    <h3 class="column-title">{{ category?.title || 'Sem Título' }}</h3>
    
    <!-- Lista de Posts (Sem Drag-and-Drop) -->
    <div class="kanban-list">
      <PostCard 
        v-for="post in category?.posts || []"
        :key="post.id"
        :post="post" 
        @edit="onEditPost"
        @delete="onDeletePost"
      />
      
      <!-- Mensagem opcional se a coluna estiver vazia -->
      <div v-if="!category?.posts || category.posts.length === 0" class="empty-message">
        Sem posts
      </div>
    </div>
    
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import PostCard from './PostCard.vue';

// CORREÇÃO: Removemos 'const props =' porque não estamos usando 'props' no script.
// O defineProps ainda funciona e disponibiliza 'category' para o template.
defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit-post', 'delete-post']);

const onEditPost = (post) => {
  emit('edit-post', post);
};

const onDeletePost = (postId) => {
  emit('delete-post', postId);
};
</script>

<style scoped>
.column {
  flex: 0 0 300px; /* Largura fixa da coluna */
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
  min-height: 100px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto; /* Permite scroll se houver muitos posts */
}
.empty-message {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>