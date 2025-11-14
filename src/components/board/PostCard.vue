<template>
  <div class.post-card :class="{ 'is-owner': isOwner }">
    <div class="card-header">
      <h4>{{ post.title }}</h4>
      
      <!-- MUDANÇA: Botões de Ação -->
      <!-- A lógica 'v-if="isOwner"' agora funciona porque 'isOwner' -->
      <!-- está a ler 'post.autor.id' (ver <script>) -->
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
      <!-- MUDANÇA: Exibição do Autor -->
      <!-- Antes (Mock): <span class="author">{{ post.author?.name }}</span> -->
      <!-- Agora (Backend Real): Lemos 'post.autor.nome' -->
      <span class="author" :title="'ID: ' + post.autor.id">
        {{ post.autor ? post.autor.nome : 'Autor desconhecido' }}
      </span>
      
      <!-- Exibe as tags, se existirem -->
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

// --- MUDANÇA CRÍTICA: LÓGICA DE PROPRIEDADE ---
// Esta lógica decide se os botões de Editar/Excluir aparecem.
const isOwner = computed(() => {
  // 1. O utilizador deve estar logado (authStore.user existe)
  // 2. O post deve ter um autor (post.autor existe)
  // 3. O ID do utilizador logado (authStore.user.id) deve ser
  //    igual ao ID do autor do post (post.autor.id)
  return (
    authStore.user &&
    props.post.autor &&
    authStore.user.id === props.post.autor.id
  );
});
// --- FIM DA MUDANÇA ---

// Função para emitir o evento de edição
// O @click.stop no template impede que clicar no botão
// ative o "arrastar" do cartão.
const onEdit = () => {
  emit('edit', props.post);
};

// Função para emitir o evento de exclusão
const onDelete = () => {
  emit('delete', props.post.id);
};
</script>

<style scoped>
.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: move; /* Indica que é arrastável */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
  border-left: 5px solid transparent;
}
.post-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Opcional: Destaca o cartão que pertence ao utilizador logado */
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
  /* Permite que o texto quebre caso o título seja muito longo */
  word-break: break-word; 
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  /* Faz os botões encolherem para não ocupar espaço */
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
  white-space: pre-wrap; /* Preserva quebras de linha e "envelopa" o texto */
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
  max-width: 60%; /* Evita que tags longas "empurrem" o autor */
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>