<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <div class="header-top">
          <span class="category-badge">{{ post.category }}</span>
          <button class="close-btn" @click="$emit('close')">×</button>
        </div>
        <h2>{{ post.title }}</h2>
        <div class="meta-info">
          <span class="author">
            👤 {{ post.autor?.nome || post.autor?.login || 'Anônimo' }}
          </span>
          <span class="date">
            📅 {{ formatDate(post.dataCriacao) }}
          </span>
        </div>
      </header>

      <div class="modal-body">
        <p class="description">{{ post.description }}</p>
      </div>

      <footer class="modal-footer" v-if="post.tags && post.tags.length">
        <div class="tags-list">
          <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
defineProps({
  post: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100; /* Maior que a navbar */
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.category-badge {
  background-color: #e3f2fd;
  color: #0d47a1;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #000;
}

h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.meta-info {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
}

.modal-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #f5f5f5;
  color: #555;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
}
</style>