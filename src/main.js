// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// CSS Global
import './assets/main.css'

// Configura a instância do Axios (veja o próximo passo)
import { setupAxiosInterceptors } from './services/ApiService'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Antes de montar o app, configura os interceptors do Axios
// Isso é crucial para a autenticação JWT
setupAxiosInterceptors()

app.mount('#app')