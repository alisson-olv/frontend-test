# Simulador de Loja Online e Delivery

Este é um projeto de simulador de loja online com filtragem de produtos por CEP e gerenciamento de carrinho de compras.

## 🚀 Tecnologias Utilizadas

- **Frontend:** HTML, CSS (Tailwind), JavaScript Vanilla
- **Backend:** Node.js (Express) - para chamadas de API
- **Docker:** Para conteinerização da aplicação

## 📋 Funcionalidades

- Listagem de produtos
- Filtragem por nome do produto
- Filtragem de produtos por estado (baseado no CEP do usuário)
- Adição e remoção de produtos no carrinho
- Persistência do carrinho com LocalStorage

## 📂 Estrutura do Projeto

```
/frontend-test
│
├── /frontend
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── /backend
│   ├── src
│   │   ├── server.ts
│   │   ├── routes.ts
│   │   └── services
│   │       ├── productsService.ts
│   │       └── cepService.ts
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

## 🛠️ Instalação e Execução

1️⃣ Clone o repositório:

```bash
git clone https://github.com/alisson-olv/frontend-test.git
```

2️⃣ Acesse a pasta do projeto:

```bash
cd frontend-test
```

3️⃣ Copie o arquivo `.env.example` que está dentro da pasta `/backend`, renomeando para `.env`:

```
cp backend/.env.example backend/.env
```

4️⃣ No arquivo `.env`, adicione a sua API key:

```
API_KEY=SUA_API_KEY_AQUI
```

5️⃣ Construa os containers Docker:

```bash
docker compose build
```

6️⃣ Suba a aplicação:

```bash
docker compose up
```

7️⃣ Acesse o projeto no navegador:

```
http://localhost:8080/
```

## 🐳 Docker

- O Dockerfile do backend configura o ambiente Node.js para rodar a aplicação.
- O Docker Compose simplifica a execução da aplicação com um único comando.

## 🤖 API

- Produtos: `GET https://alphalabs.webdiet.com.br/api/products`
- CEP: `GET https://viacep.com.br/ws/{valor}/json/`

## 📌 Observações

- O filtro por CEP retorna o estado (UF) associado ao endereço do usuário.
- Apenas produtos com estoque em depósitos dentro do mesmo estado são exibidos.

## 📈 Melhorias Futuras

- Validação de CEPs inválidos.
- Paginação da listagem de produtos.
- Testes unitários para o backend.

---

✨ Projeto desenvolvido com foco em organização, boas práticas e experiência do usuário!
