<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleRegister">
      <h2>Registo - ComuniDesk</h2>
      
      <div class="form-group">
        <label for="name">Nome de Exibição</label>
        <input type="text" id="name" v-model="name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      
      <div class="form-group">
        <label for="password">Palavra-passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      
      <button type="submit" class="btn-submit" :disabled="isLoading">
        {{ isLoading ? 'A registar...' : 'Registar' }}
      </button>
      
      <p class="redirect-link">
        Já tem conta? <router-link to="/login">Faça login</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/AuthService';

const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

const router = useRouter();

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const userData = {
      nome: name.value,
      email: email.value,
      senha: password.value,
      login: email.value,
      role: "USER",
    };
    // --- FIM DA MUDANÇA ---
    
    // O AuthService (Arquivo 2) já está a apontar para o backend real
    // e o SecurityConfig (backend) já permite esta chamada.
    await AuthService.register(userData);
    
    successMessage.value = 'Registo efetuado com sucesso! Redirecionando para o login...';
    
    setTimeout(() => {
      router.push({ name: 'Login' });
    }, 2000);

  } catch (error) {
    console.error('Erro no registo:', error);
    // Tenta ler a mensagem de erro específica do backend, se existir
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Erro ao registar. Verifique os dados.';
    } else if (error.message.includes('Network Error')) {
      errorMessage.value = 'Não foi possível comunicar com o servidor.';
    } else {
      errorMessage.value = 'Ocorreu um erro desconhecido.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Estilos consistentes com a página de Login */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; 
}
.redirect-link {
  text-align: center;
  margin-top: 1rem;
}
.success-message {
  color: green;
  margin-bottom: 1rem;
  text-align: center;
}
/* .btn-submit e .error-message vêm do main.css */
</style>