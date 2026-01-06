# Dockerfile (na raiz)
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Expõe a porta do React
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]
