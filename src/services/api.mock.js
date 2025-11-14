/**
 * API MOCK (Banco de Dados Falso)
 * Simula o backend para testes de frontend.
 */

// --- DADOS FALSOS ---
let usersDB = [
  { id: 'user-1', name: 'Usuário Teste', email: 'teste@comunidesk.com' }
];

let postsDB = [
  { 
    id: 'post-1', 
    title: 'Item Perdido: Chaves', 
    description: 'Perdi minhas chaves perto da entrada do Bloco B.', 
    category: 'perdidos', 
    tags: ['urgente', 'chaves'], 
    author: { id: 'user-1', name: 'Usuário Teste' } 
  },
  { 
    id: 'post-2', 
    title: 'Festa no Sábado!', 
    description: 'Churrasco no salão de festas este sábado, às 18h. Tragam bebidas!', 
    category: 'eventos', 
    tags: ['festa', 'churrasco'], 
    author: { id: 'user-2', name: 'Vizinho Animado' } 
  },
  { 
    id: 'post-3', 
    title: 'Doação de Cadeira de Escritório', 
    description: 'Tenho uma cadeira de escritório antiga mas funcional para doar. Interessados, me chamem no apt 101.', 
    category: 'trocas', 
    tags: ['doação', 'móveis'], 
    author: { id: 'user-1', name: 'Usuário Teste' } 
  },
];

let currentUser = null; // Guarda o usuário logado

// --- FUNÇÕES DA API MOCK ---

/**
 * Simula uma espera de rede
 * @param {number} ms - Milissegundos para esperar
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  
  /**
   * Tenta fazer login
   */
  async login(credentials) {
    await delay(500);
    const user = usersDB.find(u => u.email === credentials.email && credentials.password === '123'); // Senha '123' para testes
    
    if (user) {
      currentUser = user; // Define o usuário logado
      return { 
        data: {
          token: 'fake-jwt-token-for-testing',
          user: user
        }
      };
    } else {
      throw new Error('Email ou senha inválidos');
    }
  },
  
  /**
   * Tenta registar um novo usuário
   */
  async register(userData) {
    await delay(500);
    const exists = usersDB.find(u => u.email === userData.email);
    if (exists) {
      throw new Error('Este email já está em uso.');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
    };
    usersDB.push(newUser);
    return { data: newUser };
  },
  
  /**
   * Busca todos os posts
   */
  async getAllPosts() {
    await delay(300);
    return { data: postsDB };
  },
  
  /**
   * Cria um novo post
   */
  async createPost(postData) {
    await delay(400);
    if (!currentUser) throw new Error('Usuário não autenticado');
    
    const newPost = {
      id: `post-${Date.now()}`,
      ...postData,
      // MUDANÇA: Garante que o autor correto (logado) é atribuído
      author: {
        id: currentUser.id,
        name: currentUser.name,
      }
    };
    postsDB.push(newPost);
    return { data: newPost };
  },
  
  /**
   * Atualiza um post
   */
  async updatePost(postId, postData) {
    await delay(400);
    if (!currentUser) throw new Error('Usuário não autenticado');

    const postIndex = postsDB.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('Post não encontrado');
    
    // Verifica se o usuário logado é o autor
    if (postsDB[postIndex].author.id !== currentUser.id) {
      throw new Error('Ação não autorizada');
    }
    
    postsDB[postIndex] = { ...postsDB[postIndex], ...postData };
    return { data: postsDB[postIndex] };
  },

  /**
   * Exclui um post
   */
  async deletePost(postId) {
    await delay(400);
    if (!currentUser) throw new Error('Usuário não autenticado');

    const postIndex = postsDB.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('Post não encontrado');

    // Verifica se o usuário logado é o autor
    if (postsDB[postIndex].author.id !== currentUser.id) {
      throw new Error('Ação não autorizada');
    }

    const deletedPost = postsDB.splice(postIndex, 1);
    return { data: deletedPost[0] };
  }
};