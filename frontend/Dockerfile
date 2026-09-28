FROM node:20-alpine

WORKDIR /app

# Copiar manifesto de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte do Angular
COPY . .

# Expor porta do servidor de desenvolvimento do Angular
EXPOSE 4200

# Executar Angular ouvindo em todas as interfaces para acesso externo
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check", "--poll", "2000"]
