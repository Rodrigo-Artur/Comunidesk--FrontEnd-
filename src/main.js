import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { setupAxiosInterceptors } from './services/ApiService'

const app = createApp(App)
const pinia = createPinia()

// --- CORREÇÃO DE ORDEM ---

// 1. Instalar o Pinia PRIMEIRO (Isso corrige o erro "getActivePinia")
app.use(pinia)

// 2. Instalar o Router DEPOIS
app.use(router)

// 3. Configurar o Axios POR ÚLTIMO
// (Agora é seguro chamar stores dentro dele se necessário)
setupAxiosInterceptors()

app.mount('#app')