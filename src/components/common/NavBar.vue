<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="Comunidesk Logo" class="logo" />
      <span class="navbar-title">Comunidesk</span>
    </div>
    
    <div class="navbar-right">
      <!-- Mostra o nome do utilizador se ele estiver logado -->
      <span v-if="userDisplay" class="username">
        <!-- 
          Agora que 'userDisplay' vai mostrar o 'login' (ex: "felipe123"),
          esta saudação faz sentido.
        -->
        Olá, {{ userDisplay }}
      </span>
      
      <!-- Botão "Sair" (chama a função logout) -->
      <button class="btn-logout" @click="handleLogout">
        Sair
      </button>
    </div>
  </nav>
</template>

<script setup>
/* global defineEmits */
import { computed } from 'vue';
import { authState, logout } from '@/store/auth.js';

defineEmits([]);

// Usamos 'computed' para obter o nome de login de forma segura
const userDisplay = computed(() => {
  // --- MUDANÇA ---
  // O seu backend não suporta 'nome'.
  // O nosso novo 'store/auth.js' guarda o 'login' do utilizador.
  // Vamos usar o 'login' como nome de exibição.
  return authState.value.user?.login;
  // --- FIM DA MUDANÇA ---
});

// Função que é chamada quando o botão "Sair" é clicado
const handleLogout = () => {
  logout(); // Chama a função importada
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  height: 32px;
}

.navbar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-size: 0.9rem;
  color: #555;
}

.btn-logout {
  padding: 0.6rem 1rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
</style>