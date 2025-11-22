<template>
  <div class="post-card" :class="{ 'is-owner': isOwner }">
    <div class="card-header">
      <h4>{{ post.title }}</h4>
      
      <div v-if="isOwner" class="card-actions">
        <button @click.stop="onEdit" class="btn-icon btn-edit" title="Editar post">
          ✏️
        </button>
        <button @click.stop="onDelete" class="btn-icon btn-delete" title="Excluir post">
          🗑️
        </button>
      </div>
    </div>

    <p class="card-description">{{ post.description }}</p>
    
    <div class="card-footer">
      <!-- CORREÇÃO DEFENSIVA AQUI -->
      <!-- Usamos o operador ?. (Optional Chaining) para evitar erro se 'post.autor' for null/undefined -->
      <span class="author" :title="post.autor ? 'ID: ' + post.autor.id : 'Sem ID'">
        {{ post.autor ? post.autor.nome : 'Autor desconhecido' }}
      </span>
      
      <span v-if="post.tags && post.tags.length" class="tags">
        {{ post.tags.join(', ') }}
      </span>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';

// eslint-disable-next-line no-undef
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['edit', 'delete']);

const authStore = useAuthStore();

const isOwner = computed(() => {
  // Verificação defensiva também na lógica de computed
  return (
    authStore.user &&
    props.post.autor &&
    authStore.user.id === props.post.autor.id
  );
});

const onEdit = () => {
  emit('edit', props.post);
};

const onDelete = () => {
  emit('delete', props.post.id);
};
</script>

<style scoped>
.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: move;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
  border-left: 5px solid transparent;
}
.post-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.post-card.is-owner {
  border-left-color: #007bff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.card-header h4 {
  margin: 0;
  font-size: 1.1rem;
  word-break: break-word; 
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
}
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
}
.btn-icon:hover {
  opacity: 1;
}
.btn-edit:hover {
  color: #007bff;
}
.btn-delete:hover {
  color: #dc3545;
}

.card-description {
  font-size: 0.95rem;
  color: #333;
  margin: 0.5rem 0 1rem 0;
  white-space: pre-wrap;
  word-break: break-word;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #777;
}
.author {
  font-weight: 500;
}
.tags {
  font-style: italic;
  max-width: 60%;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>