<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleLogin">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h2>Login</h2>
      <div class="form-group">
        <label for="login">Usuário (Login)</label>
        <input type="text" id="login" v-model="form.login" required />
      </div>
      <div class="form-group">
        <label for="senha">Senha</label>
        <input type="password" id="senha" v-model="form.senha" required />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button type="submit" class="btn-submit" :disabled="isLoading">
        {{ isLoading ? 'A entrar...' : 'Entrar' }}
      </button>
      <p class="switch-auth">
        Não tem conta? <router-link to="/register">Crie uma</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Importamos a função 'login' diretamente do nosso store
import { login } from '@/store/auth.js';

// Usamos 'ref' para o formulário
const form = ref({
  login: '',
  senha: '', // Corrigido de 'password' para 'senha'
});
const isLoading = ref(false);
const errorMessage = ref(null);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    // Agora o form.value contém { login, senha }
    await login(form.value);
    // O 'store/auth.js' já trata do redirecionamento
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao fazer login. Verifique o usuário e a senha.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* --- MUDANÇA --- */
/* Estilos completos copiados do RegisterView para consistência visual */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}
.auth-form {
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.logo {
  display: block;
  margin: 0 auto 1.5rem;
  height: 50px;
}
.auth-form h2 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
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
  box-sizing: border-box; /* Garante que o padding não afete a largura */
}
.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
.btn-submit:disabled {
  background-color: #9ca3af;
}
.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
}
.switch-auth {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
.switch-auth a {
  color: #3b82f6;
  text-decoration: none;
}
/* --- FIM DA MUDANÇA --- */
</style>