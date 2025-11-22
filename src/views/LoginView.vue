<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Login - ComuniDesk</h2>
      
      <div class="form-group">
        <!-- CORREÇÃO: Alterado de Email para Login -->
        <label for="login">Login (Nome de Usuário)</label>
        <!-- Alterado type="email" para type="text" para aceitar nomes de usuário -->
        <input type="text" id="login" v-model="login" required placeholder="Digite seu usuário" />
      </div>
      
      <div class="form-group">
        <label for="password">Palavra-passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      
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

// CORREÇÃO: Renomeado de email para login
const login = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // O objeto enviado deve ter a chave 'login' para bater com LoginRequestDTO do backend
    const credentials = {
      login: login.value,
      password: password.value,
    };
    
    const success = await authStore.login(credentials);

    if (success) {
      router.push({ name: 'Dashboard' });
    } else {
      errorMessage.value = 'Login ou palavra-passe inválidos.';
    }
    
  } catch (error) {
    console.error('Erro no login:', error);
    if (error.response && error.response.status === 403) {
        errorMessage.value = "Credenciais incorretas.";
    } else {
        errorMessage.value = error.message || 'Erro ao fazer login.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
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
</style>