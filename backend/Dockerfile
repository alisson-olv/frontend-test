FROM node:18

# Diretório do aplicativo
WORKDIR /app/src

# Copiar os arquivos de dependência
COPY package*.json ../

# Copia o arquivo .env para o container
COPY .env ../

# Instalar dependências
RUN npm install --prefix ../

# Copiar o código do backend
COPY . .

# Expor a porta 5000 para o backend
EXPOSE 5000

# Rodar o servidor Express
CMD ["npm", "run", "dev"]