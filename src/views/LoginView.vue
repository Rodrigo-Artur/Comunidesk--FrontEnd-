<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Login - ComuniDesk</h2>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      
      <div class="form-group">
        <label for="password">Palavra-passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      
      <!-- MUDANÇA: Onde a mensagem de erro será exibida -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      
      <button type="submit" class="btn-submit" :disabled="isLoading">
        {{ isLoading ? 'A entrar...' : 'Entrar' }}
      </button>
      
      <p class="redirect-link">
        Não tem conta? <router-link to="/register">Registe-se aqui</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
// MUDANÇA: Já não precisamos de importar o AuthService diretamente aqui
// import AuthService from '@/services/AuthService';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null); // Ref para a mensagem de erro

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const credentials = {
      login: email.value,
      senha: password.value,
    };
    
    // MUDANÇA: Removemos a chamada direta ao AuthService
    // const response = await AuthService.login(credentials); // <-- LINHA REMOVIDA
    
    // Chamamos APENAS a ação do store. 
    // O store é responsável por chamar o AuthService.
    const success = await authStore.login(credentials);

    if (success) {
      router.push({ name: 'Dashboard' });
    } else {
      // Se o store.login retornar false (sem lançar erro)
      errorMessage.value = 'Email ou palavra-passe inválidos.';
    }
    
  } catch (error) {
    // Se o store.login (ou o AuthService dentro dele) lançar um erro
    console.error('Erro no login:', error.message);
    errorMessage.value = error.message; 
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Estilos consistentes com a página de Registo */
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
/* .btn-submit e .error-message vêm do main.css */
</style>