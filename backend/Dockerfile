# Usando uma imagem oficial do Node.js
FROM node:18

# Diretório do aplicativo
WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código do backend
COPY . .

# Expor a porta 3000 para o backend
EXPOSE 3000

# Rodar o servidor Express
CMD ["npm", "run", "dev"]
