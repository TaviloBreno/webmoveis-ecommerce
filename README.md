# WebMoveis E-commerce API

API RESTful completa para e-commerce desenvolvida com NestJS, Prisma e PostgreSQL.

## 📋 Descrição

Sistema de e-commerce com autenticação JWT, gestão de produtos, categorias, lojas, pedidos e cálculo de frete.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Registro de usuários
- Login com JWT
- Autenticação Bearer Token

### 👤 Gestão de Usuários
- Visualizar perfil
- Atualizar informações do perfil
- Alterar senha

### 🏪 Lojas
- Registro de lojas
- Listagem de lojas
- Detalhes da loja

### 📦 Produtos
- Listagem de produtos (com filtro por categoria)
- Detalhes do produto (com múltiplas imagens)
- Produtos associados a categorias e lojas

### 🗂️ Categorias
- Listagem de categorias
- Produtos por categoria

### 📮 Frete
- Cálculo de frete baseado em CEP e dimensões
- Múltiplas opções de transportadoras (SEDEX, PAC, Expresso)

### 🛒 Pedidos
- Criação de pedidos (realizar compra)
- Listagem de pedidos do usuário
- Detalhes do pedido
- Controle de estoque automático
- Validação de disponibilidade

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Swagger** - Documentação da API
- **TypeScript** - Linguagem
- **Jest** - Testes

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar migrations
npm run migration:make init_database

# (Opcional) Popular banco de dados
npx prisma db seed
```

## ⚙️ Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/webmoveis_db?schema=public"
JWT_SECRET="your-secret-key-here-change-in-production"
PORT=3000
```

## 🏃 Executar o Projeto

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Watch mode
npm run start:watch
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação Swagger:

```
http://localhost:3000/docs
```

## 🔑 Endpoints Principais

### Autenticação (Público)
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login

### Usuários (Autenticado)
- `GET /users/profile` - Obter perfil
- `PUT /users/profile` - Atualizar perfil
- `PUT /users/password` - Atualizar senha

### Produtos (Público)
- `GET /products` - Listar produtos
- `GET /products/:id` - Detalhes do produto

### Categorias (Público)
- `GET /categories` - Listar categorias

### Lojas (Público)
- `POST /stores/register` - Registrar loja
- `GET /stores` - Listar lojas
- `GET /stores/:id` - Detalhes da loja

### Frete (Público)
- `POST /shipping/calculate` - Calcular frete

### Pedidos (Autenticado)
- `POST /orders` - Criar pedido (comprar)
- `GET /orders` - Listar meus pedidos
- `GET /orders/:id` - Detalhes do pedido

## 🔐 Autenticação

Para rotas protegidas, inclua o token JWT no header:

```
Authorization: Bearer {seu-token-jwt}
```

No Swagger, clique no botão "Authorize" e cole o token.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **User** - Usuários do sistema
- **Store** - Lojas cadastradas
- **Category** - Categorias de produtos
- **Product** - Produtos disponíveis
- **ProductImage** - Imagens dos produtos
- **Order** - Pedidos realizados
- **OrderItem** - Itens dos pedidos

## 📖 Exemplo de Uso

### 1. Registrar usuário
```bash
POST /auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "11987654321"
}
```

### 2. Fazer login
```bash
POST /auth/login
{
  "email": "joao@email.com",
  "password": "senha123"
}
# Retorna: { "access_token": "eyJhbGc..." }
```

### 3. Criar pedido
```bash
POST /orders
Authorization: Bearer {token}
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 3, "quantity": 1 }
  ],
  "shipping_address": "Rua das Flores, 123",
  "shipping_city": "São Paulo",
  "shipping_state": "SP",
  "shipping_zip_code": "01234-567",
  "shipping_cost": 15.50,
  "shipping_method": "SEDEX"
}
```

## 🧪 Testes Implementados

### AuthService
- ✅ Registro de usuários
- ✅ Validação de email duplicado
- ✅ Login com credenciais válidas
- ✅ Validação de senha incorreta
- ✅ Validação de usuário

### UsersService
- ✅ Obter perfil do usuário
- ✅ Atualizar informações do perfil
- ✅ Atualizar senha
- ✅ Validação de senha atual

### OrdersService
- ✅ Criação de pedido
- ✅ Validação de produtos
- ✅ Validação de estoque
- ✅ Listagem de pedidos do usuário
- ✅ Detalhes do pedido

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando NestJS
