<template>
  <!-- O layout principal da aplicação -->
  <div id="app-layout">
    
    <!-- 
      O NavBar só é exibido se o utilizador estiver autenticado.
      O 'isAuthenticated' vem do store do Pinia.
      Isto esconde o NavBar nas páginas de Login e Registo.
    -->
    <NavBar v-if="isAuthenticated" />
    
    <!-- 
      Área de conteúdo principal.
      <router-view> é o marcador mágico onde o Vue Router
      irá renderizar a página correspondente à URL atual 
      (ex: LoginView, DashboardView, etc.)
    -->
    <main class="main-content">
      <router-view />
    </main>
    
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';
import NavBar from '@/components/common/NavBar.vue'; // Importa o NavBar que criámos

// Acede ao store de autenticação
const authStore = useAuthStore();

// Cria uma propriedade reativa (computed) que nos diz se o
// utilizador está logado. O 'App.vue' irá "ouvir"
// mudanças nisto e re-renderizar automaticamente.
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped>
/* Estes estilos aplicam-se APENAS ao App.vue 
  (note o 'scoped') 
*/
#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Faz com que o conteúdo principal ocupe o espaço restante */
  
  /* Se o NavBar for 'position: fixed', precisaria de um 'padding-top' aqui.
     Mas com 'flex-direction: column', o layout flui naturalmente. */
}
</style>