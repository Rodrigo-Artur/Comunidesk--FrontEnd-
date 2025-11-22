<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <!-- Nome do Site -->
          <strong>ComuniDesk</strong>
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <!-- Só mostra se houver usuário logado -->
        <div v-if="user" class="navbar-user">
          <!-- CORREÇÃO: Prioriza 'user.login'. Usa 'user.name' ou 'Visitante' como fallback. -->
          <span class="user-greeting">Olá, <strong>{{ user.login || user.name || 'Visitante' }}</strong></span>
          
          <!-- Botão de Logout -->
          <button @click="handleLogout" class="btn-logout" title="Sair do sistema">
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

// Acessa o estado do usuário no Pinia
const user = computed(() => authStore.user);

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.navbar {
  background-color: #343a40;
  color: white;
  padding: 0.75rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
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
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}
.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-greeting {
  font-size: 0.95rem;
  color: #e0e0e0;
}
.btn-logout {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}
.btn-logout:hover {
  background-color: #c82333;
}
</style>