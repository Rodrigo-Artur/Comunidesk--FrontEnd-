<template>
  <div class="column">
    <h3 class="column-title">{{ category ? category.title : 'Sem Título' }}</h3>
    
    <div class="kanban-list">
      <PostCard 
        v-for="post in (category && category.posts ? category.posts : [])"
        :key="post.id"
        :post="post" 
        @edit="onEditPost"
        @delete="onDeletePost"
        @view="onViewPost" 
      />
      
      <div v-if="!category || !category.posts || category.posts.length === 0" class="empty-message">
        Sem posts
      </div>
    </div>
    
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import PostCard from './PostCard.vue';

defineProps({
  category: {
    type: Object,
    required: true,
  },
});

// Adicionado 'view-post'
const emit = defineEmits(['edit-post', 'delete-post', 'view-post']);

const onEditPost = (post) => {
  emit('edit-post', post);
};

const onDeletePost = (postId) => {
  emit('delete-post', postId);
};

// Repassa o evento para cima
const onViewPost = (post) => {
  emit('view-post', post);
};
</script>

<style scoped>
/* ... (mesmo estilo de antes) ... */
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
  min-height: 100px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
}
.empty-message {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>