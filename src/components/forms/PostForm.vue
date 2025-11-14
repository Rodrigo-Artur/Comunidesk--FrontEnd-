<template>
  <!-- O "overlay" escuro do modal -->
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>{{ isEditing ? 'Editar Post' : 'Criar Novo Post' }}</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título</label>
          <input type="text" id="title" v-model="form.title" required />
        </div>
        
        <div class="form-group">
          <label for="description">Descrição</label>
          <textarea id="description" v-model="form.description" rows="5" required></textarea>
        </div>
        
        <div class="form-group">
          <label for="category">Categoria</label>
          <select id="category" v-model="form.category" required>
            
            <!-- Os valores aqui já estavam corretos (baseados no seu código) -->
            <option value="Aviso_Gerais">Aviso</option>
            <option value="EVENTO">Eventos</option>
            <option value="TROCA">Trocas/Doações</option>
            <option value="ACHADO_PERDIDO">Achados e Perdidos</option>
            <option value="RECOMENDACAO">Dicas e Recomendações</option>
            <option value="ARTIGO">Artigos</option>
            
          </select>
        </div>
        
        <div class="form-group">
          <label for="tags">Tags (separadas por vírgula)</label>
          <input type="text" id="tags" v-model="form.tags" />
        </div>
                
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="close">Cancelar</button>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'A guardar...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
/* global defineProps, defineEmits */
import { ref, watch, onMounted } from 'vue';
import PostService from '@/services/PostService'; // O Arquivo 3

// Props: 'postToEdit' será null para "criar" e um objeto para "editar"
const props = defineProps({
  postToEdit: {
    type: Object,
    default: null,
  },
});

// Emits: eventos que o componente "dispara" para o pai
const emit = defineEmits(['close', 'post-saved']);

const isLoading = ref(false);
const errorMessage = ref(null);

// O 'isEditing' é reativo e depende da prop
const isEditing = ref(false);

// O objeto do formulário
const form = ref({
  id: null,
  title: '',
  description: '',
  // --- CORREÇÃO (Linha 1) ---
  // O valor padrão deve ser "Aviso_Gerais" para bater com o Enum do backend
  // e com a <option> no template.
  category: 'Aviso_Gerais', 
  tags: '', 
});

// Esta função preenche o formulário quando a prop 'postToEdit' é recebida
const setFormFromProps = () => {
  if (props.postToEdit) {
    isEditing.value = true;
    form.value.id = props.postToEdit.id;
    form.value.title = props.postToEdit.title;
    form.value.description = props.postToEdit.description;
    form.value.category = props.postToEdit.category; // Ex: "Aviso_Gerais"
    // Garante que 'tags' é um array antes de dar 'join'
    form.value.tags = Array.isArray(props.postToEdit.tags) ? props.postToEdit.tags.join(', ') : '';
  } else {
    isEditing.value = false;
    // Reseta o formulário
    // --- CORREÇÃO (Linha 2) ---
    // O reset do formulário também deve usar o valor padrão correto.
    form.value = { id: null, title: '', description: '', category: 'Aviso_Gerais', tags: '' };
  }
};

// Observa mudanças na prop (caso o modal seja reutilizado)
watch(() => props.postToEdit, setFormFromProps);

// Preenche o formulário quando o componente é montado
onMounted(setFormFromProps);

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const postData = {
      title: form.value.title,
      description: form.value.description,
      category: form.value.category, // O 'v-model' agora envia o valor correto (ex: "Aviso_Gerais")
      // Converte a string de tags num array
      tags: form.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag), 
    };

    if (isEditing.value) {
      // --- MODO EDIÇÃO ---
      await PostService.updatePost(form.value.id, postData);
    } else {
      // --- MODO CRIAÇÃO ---
      await PostService.createPost(postData);
    }
    
    // Sucesso!
    // Avisa o componente-pai (DashboardView) para fechar o modal
    emit('post-saved');
    
  } catch (error) {
    console.error("Erro ao guardar o post:", error);
    // Tenta ler a mensagem de erro específica do backend, se existir
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Não foi possível se comunicar com o servidor.';
    }
  } finally {
    isLoading.value = false;
  }
};

const close = () => {
  emit('close');
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
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
/* .btn-submit e .error-message vêm do main.css */
</style>