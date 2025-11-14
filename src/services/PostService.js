import apiClient from './ApiService';
// MUDANÇA: Já não precisamos de importar o mockAPI
// import { mockAPI } from './api.mock.js';

// MUDANÇA CRÍTICA: Este é o segundo interruptor.
// Ao definir como 'false', estamos a ligar o nosso quadro
// ao backend real.
const USE_MOCKS = false;

const PostService = {
  
  getAllPosts() {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.getAllPosts();
    }
    // MUDANÇA: Agora, esta linha será executada.
    // O Guia da API (Secção 4.2) confirma o endpoint.
    return apiClient.get('/posts');
  },

  createPost(postData) {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.createPost(postData);
    }
    // MUDANÇA: O Guia da API (Secção 4.1) confirma o endpoint.
    return apiClient.post('/posts', postData);
  },

  updatePost(postId, postData) {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.updatePost(postId, postData);
    }
    // MUDANÇA: O Guia da API (Secção 4.4) confirma o endpoint.
    return apiClient.put(`/posts/${postId}`, postData);
  },

  deletePost(postId) {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.deletePost(postId);
    }
    // MUDANÇA: O Guia da API (Secção 4.5) confirma o endpoint.
    return apiClient.delete(`/posts/${postId}`);
  },

  uploadFile(file) {
    if (USE_MOCKS) {
      // Esta parte do código deixará de ser executada
      // return mockAPI.uploadFile(file); 
    }
    // MUDANÇA: Esta chamada (embora não usada ainda) está pronta.
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

export default PostService;