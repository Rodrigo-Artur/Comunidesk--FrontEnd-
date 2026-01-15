# 📋 Comunidesk - Frontend

Interface web moderna para o sistema de gestão de solicitações e tarefas comunitárias **Comunidesk**. Desenvolvido como uma **Single Page Application (SPA)**, este projeto foca em interatividade e experiência do usuário, utilizando um quadro estilo **Kanban** para organização visual.

Este projeto consome a API REST do [Comunidesk Backend](https://github.com/Rodrigo-Artur/comunideskback).

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando o ecossistema moderno do Vue.js:

* **[Vue.js 3](https://vuejs.org/)** - Framework JavaScript progressivo (utilizando **Composition API** `<script setup>`).
* **[Pinia](https://pinia.vuejs.org/)** - Gerenciamento de estado global (substituto moderno do Vuex).
* **[Vue Router](https://router.vuejs.org/)** - Gerenciamento de rotas e navegação da SPA.
* **[Axios](https://axios-http.com/)** - Cliente HTTP para comunicação com a API Backend.
* **CSS3** - Estilização customizada e responsiva.

## ✨ Funcionalidades

* **🔐 Autenticação e Segurança:**
    * Login e Registro de usuários.
    * Integração com JWT (JSON Web Tokens) via interceptors do Axios.
    * Proteção de rotas (Navigation Guards) para impedir acesso não autorizado.
* **📊 Kanban Board Interativo:**
    * Visualização de solicitações/posts em colunas dinâmicas.
    * Cards detalhados com informações das tarefas.
* **📝 Gestão de Posts:**
    * Criação de novos cards/solicitações via modal.
    * Visualização de detalhes expandidos.
* **⚡ Arquitetura Reativa:**
    * Atualização de estado em tempo real no frontend utilizando Stores do Pinia (`auth.js`, `board.js`).

## 📂 Estrutura do Projeto

```text
src/
├── assets/          # Imagens e estilos globais (main.css)
├── components/      # Componentes Vue reutilizáveis
│   ├── board/       # Componentes do Kanban (Colunas, Cards, Modais)
│   ├── common/      # Componentes globais (NavBar, Footer)
│   └── forms/       # Formulários (Criação de Posts)
├── router/          # Configuração de rotas (Vue Router)
├── services/        # Camada de integração com API (Axios)
├── store/           # Gerenciamento de estado (Pinia)
└── views/           # Páginas principais (Login, Register, Dashboard)
```

🔧 Pré-requisitos
Antes de começar, certifique-se de ter instalado:

Node.js (Versão 16+ recomendada)

NPM

O Backend do Comunidesk rodando na porta 8080 (necessário para login e dados).

📦 Como Rodar o Projeto
Clone o repositório

git clone [https://github.com/SEU-USUARIO/comunidesk-frontend.git](https://github.com/SEU-USUARIO/comunidesk-frontend.git)
cd comunidesk-frontend

Instale as dependências
npm install

Configure a API (Opcional) O projeto está configurado por padrão para conectar em http://localhost:8080/api. Se necessário, altere a URL base no arquivo: src/services/ApiService.js.

Execute o servidor de desenvolvimento

npm run serve

Acesse a aplicação Abra seu navegador em: http://localhost:8081 (ou a porta indicada no terminal).

🛠️ Scripts Disponíveis
npm run serve: Roda a aplicação em modo de desenvolvimento com Hot-Reload.

npm run build: Compila a aplicação para produção na pasta dist/.

npm run lint: Executa o Linter para verificar e corrigir erros de código.

Autor 🤝

Rodrigo Artur

[LinkedIn](https://www.linkedin.com/in/rodrigo-artur-508840336/)

🤝 Autor
Rodrigo Artur

Projeto desenvolvido como parte do portfólio acadêmico em Análise e Desenvolvimento de Sistemas.
