import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// A importação de 'setupAxiosInterceptors' foi removida
import './assets/main.css'

// A chamada de 'setupAxiosInterceptors()' foi removida

const app = createApp(App)

app.use(router)

app.mount('#app')