<template>
  <div class="column">
    <h3 class="column-title">{{ category.title }}</h3>
    
    <draggable
      class="kanban-list"
      :list="category.posts"
      group="posts"
      itemKey="id"
      @change="onDragChange"
      :data-category-id="category.id"
    >
      <!--
        MUDANÇA: TODOS os comentários foram movidos para FORA
        do slot #item.
      -->
      <!-- 
        Agora o PostCard é o ÚNICO filho do template,
        e os listeners @edit e @delete repassam os eventos.
      -->
      <template #item="{ element: post }">
        <PostCard 
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
  category: {
    type: Object,
    required: true,
  },
});

// MUDANÇA: Definir os eventos que este componente repassará
// eslint-disable-next-line no-undef
const emit = defineEmits(['edit-post', 'delete-post']);

// eslint-disable-next-line no-unused-vars
const boardStore = useBoardStore();

const onDragChange = (event) => {
  if (event.added) {
    const postId = event.added.element.id;
    const newCategory = props.category.id;
    
    // TODO: Chamar o Pinia store para persistir a mudança de categoria
    // boardStore.movePost(postId, newCategory, ...);
    console.log(`Post ${postId} movido para ${newCategory}`);
  }
}

// MUDANÇA: Funções que repassam os eventos para o componente pai (KanbanBoard)
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
  height: fit-content; /* Faz a coluna se ajustar ao conteúdo */
}
.column-title {
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ccc;
}
.kanban-list {
  min-height: 150px; /* Área mínima para soltar */
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>