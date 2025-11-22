<template>
  <div id="app-layout">
    
    <!-- AQUI ESTÁ A BARRA SUPERIOR (NAVBAR) -->
    <!-- Ela contém o "ComuniDesk", o Nome do Usuário e o botão Sair -->
    <NavBar v-if="isAuthenticated" />
    
    <main class="main-content">
      <router-view />
    </main>
    
  </div>
</template>

<script setup>
import { computed } from 'vue';
// IMPORTANTE: Importar com chaves { } porque é uma exportação nomeada
import { useAuthStore } from '@/store/auth';
import NavBar from '@/components/common/NavBar.vue';

const authStore = useAuthStore();

// Propriedade reativa que controla a visibilidade da barra
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: #f0f2f5; /* Fundo cinza claro para todo o site */
}
</style>