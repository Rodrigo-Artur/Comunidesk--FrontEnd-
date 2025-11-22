<template>
  <!-- Adicionado @click="onView" no elemento principal -->
  <div class="post-card" :class="{ 'is-owner': isOwner }" @click="onView">
    <div class="card-header">
      <h4 class="post-title">{{ post.title }}</h4>
      
      <!-- 
        MUDANÇA: Agora verifica 'canEdit' em vez de apenas 'isOwner'.
        Isso permite que Admins vejam os botões em qualquer post.
      -->
      <div v-if="canEdit" class="card-actions">
        <button @click.stop="onEdit" class="btn-icon btn-edit" title="Editar">✏️</button>
        <button @click.stop="onDelete" class="btn-icon btn-delete" title="Excluir">🗑️</button>
      </div>
    </div>

    <!-- Limita a descrição a 3 linhas visualmente -->
    <p class="card-description line-clamp">{{ post.description }}</p>
    
    <div class="card-footer">
      <div class="author-info">
        <span class="author-icon">👤</span>
        <span class="author-name" :title="authorId ? 'ID: ' + authorId : ''">
          {{ authorName }}
        </span>
      </div>
      
      <!-- Indicador de "Ver mais" -->
      <span class="expand-hint" title="Clique para ver detalhes">↗️</span>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

// Adicionado evento 'view'
const emit = defineEmits(['edit', 'delete', 'view']);

const authStore = useAuthStore();

const authorObj = computed(() => props.post.usuario || props.post.user || props.post.autor);

const authorName = computed(() => {
  const auth = authorObj.value;
  if (!auth) return 'Anônimo';
  return auth.name || auth.login || auth.username || auth.email || 'Usuário';
});

const authorId = computed(() => authorObj.value?.id);

const isOwner = computed(() => {
  return (
    authStore.user &&
    authorId.value &&
    authStore.user.id === authorId.value
  );
});

// NOVA COMPUTADA: Verifica se pode editar (Dono OU Admin)
const canEdit = computed(() => {
  // Se não estiver logado, não pode editar nada
  if (!authStore.user) return false;

  // Verifica se é admin. O backend pode retornar "ADMIN", "ROLE_ADMIN" ou similar.
  // Ajuste conforme o retorno real do seu backend no objeto 'user'.
  const isAdmin = authStore.user.role === 'ADMIN' || authStore.user.role === 'ROLE_ADMIN';

  return isOwner.value || isAdmin;
});

const onEdit = () => {
  emit('edit', props.post);
};

const onDelete = () => {
  emit('delete', props.post.id);
};

// Nova função para emitir o evento de visualização
const onView = () => {
  emit('view', props.post);
};
</script>

<style scoped>
.post-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer; /* Indica que é clicável */
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.post-card.is-owner {
  border-left-color: #28a745;
  background-color: #faffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.post-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.card-actions {
  display: flex;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem;
  border-radius: 4px;
  opacity: 0.6;
  transition: opacity 0.2s, background-color 0.2s;
}

.btn-icon:hover {
  opacity: 1;
  background-color: #f0f0f0;
}

.btn-delete:hover {
  background-color: #ffebee;
}

.card-description {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  white-space: pre-wrap;
}

/* Classe utilitária para cortar texto longo com "..." */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Mostra no máximo 3 linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.8rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-weight: 500;
}

.expand-hint {
  font-size: 0.9rem;
  opacity: 0.5;
}
</style>