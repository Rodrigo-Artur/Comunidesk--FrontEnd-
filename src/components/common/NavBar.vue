<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <!-- Link para o Dashboard (página inicial) -->
        <router-link to="/" class="brand-link">
          <!-- Pode substituir por um <img src="@/assets/logo.png" /> -->
          <strong>ComuniDesk</strong>
        </router-link>
      </div>
      
      <!-- Menu do Utilizador -->
      <div class="navbar-menu">
        <div v-if="user" class="navbar-user">
          <span class="user-greeting">Olá, {{ user.nome }}</span>
          
          <!-- Botão de Logout -->
          <button @click="handleLogout" class="btn-logout">
            Sair
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Busca o utilizador logado diretamente do store
const user = computed(() => authStore.user);

// Função para fazer logout
const handleLogout = () => {
  authStore.logout(); // Limpa o token e o utilizador do Pinia/localStorage
  router.push({ name: 'Login' }); // Redireciona para a página de login
};
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.75rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
.brand-link {
  text-decoration: none;
  color: #333;
  font-size: 1.5rem;
}
.navbar-menu {
  display: flex;
  align-items: center;
}
.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-greeting {
  font-size: 0.9rem;
  color: #555;
}
.btn-logout {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-logout:hover {
  background-color: #c82333;
}
</style>