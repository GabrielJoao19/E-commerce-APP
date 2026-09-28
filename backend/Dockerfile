FROM node:20-alpine

WORKDIR /app

# Dependências necessárias para o Prisma Client em ambiente Alpine
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar restante do código da aplicação
COPY . .

# Compilar aplicação NestJS
RUN npm run build

# Porta exposta para a API NestJS
EXPOSE 3000

# Sincroniza tabelas do Prisma, popula banco com o seed e inicia o NestJS
CMD ["sh", "-c", "npx prisma db push && npm run prisma:seed && npm run start:dev"]
