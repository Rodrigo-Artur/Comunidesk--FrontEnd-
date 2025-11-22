<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleRegister">
      <h2>Registo - ComuniDesk</h2>
      
      <!-- Se o backend não tiver campo 'name', talvez devamos usar 'login' como nome -->
      <div class="form-group">
        <label for="login">Nome de Usuário (Login)</label>
        <input type="text" id="login" v-model="login" required />
      </div>

      <!-- Se o backend usa 'login' como email, podemos manter o input type="email" mas mudar a model -->
      <!-- <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div> -->
      
      <div class="form-group">
        <label for="password">Palavra-passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <div class="form-group">
        <label for="role">Tipo de Conta</label>
        <select id="role" v-model="role" required>
          <option value="USER">Usuário Comum</option>
          <option value="ADMIN">Administrador</option>
        </select>
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

const login = ref('');
const password = ref('');
const role = ref('USER'); // Valor padrão
const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

const router = useRouter();

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    // Ajuste aqui para corresponder ao RegisterRequestDTO do Java
    const userData = {
      login: login.value,
      password: password.value,
      role: role.value
    };
    
    console.log("Enviando dados de registro:", userData); // Debug

    await AuthService.register(userData);
    
    successMessage.value = 'Registo efetuado com sucesso! Redirecionando...';
    
    setTimeout(() => {
      router.push({ name: 'Login' });
    }, 2000);

  } catch (error) {
    console.error('Erro no registo:', error);
    // Se for erro 400, geralmente é validação
    if (error.response && error.response.status === 400) {
        errorMessage.value = "Dados inválidos. Verifique se o login já existe ou a senha é muito curta.";
    } else {
        const apiErrorMessage = error.response?.data?.message || error.message || 'Erro desconhecido.';
        errorMessage.value = apiErrorMessage;
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
.form-group input, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; 
}

.success-message {
  color: green;
  margin-bottom: 1rem;
  text-align: center;
}
.redirect-link {
  text-align: center;
  margin-top: 1rem;
}
</style>