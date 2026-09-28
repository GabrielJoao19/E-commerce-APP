# 🛒 E-Commerce Full-Stack (NestJS + Prisma SQLite + Angular)

Projeto completo de loja virtual configurado com **SQLite local** (não necessita de Docker, PostgreSQL ou virtualização na BIOS).

---

## ⚡ Como Rodar o Projeto

Como o PowerShell do Windows pode bloquear scripts por padrão, execute os comandos abaixo no **Prompt de Comando (CMD)** ou libere a execução no PowerShell com:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

### 1. Iniciar o Backend (NestJS + Prisma SQLite)

Abra um terminal na pasta `backend`:

```powershell
cd backend
npm install

# Gerar o cliente Prisma e criar o banco SQLite automaticamente
npx prisma generate
npx prisma db push

# Popular o banco com dados de exemplo (produtos, categorias e usuários)
npm run prisma:seed

# Iniciar o servidor
npm run start:dev
```

- API Backend disponível em: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger (Documentação Interativa): [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- *(Opcional)* Abrir o visualizador visual do banco Prisma Studio: `npx prisma studio`

---

### 2. Iniciar o Frontend (Angular 18)

Abra **outro terminal** na pasta `frontend`:

```powershell
cd frontend
npm install
npm start
```

- Loja Virtual no Navegador: [http://localhost:4200](http://localhost:4200)

---

## 🔑 Credenciais de Teste Geradas pelo Seed

- **Administrador**:
  - E-mail: `admin@ecommerce.com.br`
  - Senha: `admin123`
- **Cliente**:
  - E-mail: `joao.silva@email.com.br`
  - Senha: `123456`

---

## 📚 Guias e Documentações Técnicas

- [Guia Completo de Autenticação com o Google OAuth 2.0](docs/autenticacao-google.md): Arquitetura, configuração no Google Cloud Console e implementação no NestJS e Angular.

