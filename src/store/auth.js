import { ref } from 'vue';
import AuthService from '@/services/AuthService';

// Função segura para ler e fazer parse do 'user'
function getSafeUserFromStorage() {
  const userString = localStorage.getItem('user');
  if (!userString || userString === 'undefined' || userString === 'null') {
    localStorage.removeItem('user'); 
    return null;
  }
  try {
    return JSON.parse(userString);
  } catch (e) {
    console.error("Falha ao fazer parse do 'user' no localStorage", e);
    localStorage.removeItem('user');
    return null;
  }
}

// Estado reativo
const user = ref(getSafeUserFromStorage()); 
const token = ref(localStorage.getItem('token') || null);
const isAuthenticated = ref(!!token.value);

export const authState = ref({
  user: user.value,
  token: token.value,
  isAuthenticated: isAuthenticated.value,
});

async function getRouter() {
  const routerModule = await import('@/router');
  return routerModule.default;
}

// Ações
export const login = async (credentials) => {
  // credentials é: { login: "...", senha: "..." }
  
  // 1. Faz a chamada de login
  const response = await AuthService.login(credentials);
  
  // 2. O backend (LoginResponseDTO) retorna SÓ o token
  const newToken = response.data.token; 

  // --- MUDANÇA CRUCIAL ---
  // O backend não nos devolve o objeto 'user', por isso
  // temos de o construir a partir dos 'credentials' que já temos.
  // O seu backend não suporta 'nome' ou 'email', por isso só temos o 'login'.
  const loggedInUser = {
    login: credentials.login 
    // Não guardamos a senha (credentials.senha) por segurança
  };
  
  // 3. Guardamos o token E o nosso objeto 'user' construído
  localStorage.setItem('token', newToken);
  localStorage.setItem('user', JSON.stringify(loggedInUser));

  // 4. Atualizamos o estado global
  authState.value = { token: newToken, user: loggedInUser, isAuthenticated: true };
  // --- FIM DA MUDANÇA ---

  const router = await getRouter();
  router.push('/dashboard');
};

export const register = async (userData) => {
  // userData é: { login: "...", senha: "...", role: "..." }
  await AuthService.register(userData);
  
  const router = await getRouter();
  router.push('/login');
};

export const logout = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  authState.value = { user: null, token: null, isAuthenticated: false };
  
  const router = await getRouter();
  router.push('/login');
};

// Sincronização de Storage
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    const newToken = event.newValue;
    token.value = newToken;
    authState.value.token = newToken;
    authState.value.isAuthenticated = !!newToken;
  }
  if (event.key === 'user') {
    const newUser = getSafeUserFromStorage();
    user.value = newUser;
    authState.value.user = newUser;
  }
});