<template>
  <div class="post-card">
    <!-- 1. Tag da Categoria -->
    <div class="card-header">
      <!-- MUDANÇA: post.category -->
      <span :class="['category-badge', getCategoryClass(post.category)]">
        {{ formatCategoryName(post.category) }}
      </span>
      
      <!-- 3. Botões de Ação (Aparecem se o usuário for o autor) -->
      <div v-if="isOwner" class="card-actions">
        <button @click.stop="onEdit" class="action-btn edit-btn" title="Editar">✏️</button>
        <button @click.stop="onDelete" class="action-btn delete-btn" title="Excluir">🗑️</button>
      </div>
    </div>

    <!-- Título e Descrição (Conteúdo Principal) -->
    <!-- MUDANÇA: post.title -->
    <h4 class="post-title">{{ post.title }}</h4>
    <!-- MUDANÇA: post.description -->
    <p class="post-description">{{ post.description }}</p>

    <!-- 2. Rodapé com Autor e Tags -->
    <div class="post-footer">
      <span class="post-author">
        <!-- MUDANÇA: post.user -->
        Por: {{ post.user?.login || 'Autor desconhecido' }}
        <!-- (Mudamos para 'login' pois 'nome' não existe no seu DTO de registo) -->
      </span>
      <div class="tags-container" v-if="post.tags && post.tags.length > 0">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { computed } from 'vue';
import { authState } from '@/store/auth.js';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit-post', 'delete-post']);

// Verifica se o usuário logado é o dono do post
const isOwner = computed(() => {
  // --- MUDANÇA: post.user ---
  if (!authState.value.user || !props.post.user) {
    return false; 
  }
  // Compara o login do authState com o login do post.user
  return authState.value.user.login === props.post.user.login;
  // --- FIM DA MUDANÇA ---
});

// Emite os eventos para o componente pai
const onEdit = () => {
  emit('edit-post', props.post);
};

const onDelete = () => {
  emit('delete-post', props.post.id);
};

// --- Funções Auxiliares para Estilização ---

const categoryMap = {
  'Aviso_Gerais': { text: 'Aviso', class: 'aviso' },
  'Eventos': { text: 'Eventos', class: 'eventos' },
  'Trocas_Doações': { text: 'Trocas', class: 'trocas' },
  'Achados_Perdidos': { text: 'Achados/Perdidos', class: 'achados' },
  'Dicas_Recomendações': { text: 'Dicas', class: 'dicas' },
};

// Retorna o texto formatado (ex: "Aviso_Gerais" -> "Aviso")
const formatCategoryName = (category) => {
  // --- MUDANÇA: post.category ---
  return categoryMap[category]?.text || category;
};

// Retorna a classe CSS para a cor (ex: "aviso", "eventos")
const getCategoryClass = (category) => {
  // --- MUDANÇA: post.category ---
  return categoryMap[category]?.class || 'default';
};
</script>

<style scoped>
/* Estilos Inalterados */
.post-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  transition: all 0.2s ease-in-out;
}
.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.category-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}
.category-badge.aviso { background-color: #f59e0b; }
.category-badge.eventos { background-color: #8b5cf6; }
.category-badge.trocas { background-color: #10b981; }
.category-badge.achados { background-color: #ef4444; }
.category-badge.dicas { background-color: #3b82f6; }
.category-badge.default { background-color: #6b7280; }
.card-actions {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 2px;
  border-radius: 4px;
}
.action-btn:hover {
  background-color: #f0f0f0;
}
.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}
.post-description {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  word-wrap: break-word;
}
.post-footer {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 0.75rem;
}
.post-author {
  font-size: 0.8rem;
  color: #777;
  font-style: italic;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.tag {
  background-color: #e5e7eb;
  color: #555;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
}
</style>