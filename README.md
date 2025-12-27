<div align="center">

# 🛒 WebMoveis E-commerce API

### **Sistema de E-commerce Enterprise Completo**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?logo=node.js)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v11+-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5+-2D3748?logo=prisma)](https://www.prisma.io/)
[![Kafka](https://img.shields.io/badge/Kafka-Enabled-231F20?logo=apache-kafka)](https://kafka.apache.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](package.json)

**API RESTful robusta e escalável para e-commerce, desenvolvida com as melhores práticas de arquitetura de software, incluindo integração com pagamentos, mensageria assíncrona e notificações por e-mail.**

[Documentação](#-documentação-da-api) • [Instalação](#-instalação) • [Recursos](#-recursos-principais) • [Tecnologias](#-stack-tecnológico)

---

</div>

## 📋 Sobre o Projeto

Sistema completo de e-commerce desenvolvido com **NestJS**, seguindo princípios **SOLID**, **Clean Architecture** e padrões de **Design Patterns**. A aplicação oferece uma solução enterprise-grade com recursos avançados de pagamento, comunicação assíncrona e notificações automatizadas.

### 🎯 Destaques Técnicos

- ✨ **Arquitetura Modular** com NestJS e TypeScript
- 🔐 **Autenticação JWT** com refresh tokens
- 💳 **Integração PagSeguro** para pagamentos seguros
- 📨 **Sistema de E-mails** com templates HTML profissionais
- 🔄 **Mensageria Kafka** para comunicação assíncrona
- 🗄️ **Prisma ORM** com PostgreSQL
- 📝 **Documentação Swagger** completa e interativa
- 🧪 **Testes Unitários** com Jest (100+ testes)
- 🚀 **Docker Ready** para deploy simplificado

---

## 🚀 Recursos Principais

### 🔒 **Autenticação & Segurança**
- Sistema de registro e login com JWT
- Criptografia de senhas com Bcrypt
- Proteção de rotas com Guards
- Validação de dados com class-validator
- Controle de acesso baseado em roles (admin/customer)

### 👤 **Gestão de Usuários**
- CRUD completo de usuários
- Perfis de usuário personalizáveis
- Sistema de roles (admin/customer)
- Gerenciamento de múltiplos endereços
- Lista de desejos (wishlist) personalizada

### 📦 **Catálogo de Produtos**
- Listagem com paginação e filtros
- **Busca avançada** por texto, preço e categoria
- Ordenação por preço, nome e data
- Sistema de categorias hierárquicas
- Múltiplas imagens por produto
- Sistema de avaliações e ratings
- Cálculo automático de média de avaliações

### 🛒 **Carrinho & Checkout**
- Carrinho de compras persistente
- Cálculo automático de subtotal
- Validação de estoque em tempo real
- Sistema de cupons e descontos
- Aplicação de descontos percentuais e fixos
- Checkout com múltiplas formas de pagamento

### 💳 **Pagamentos**
- Integração completa com PagSeguro
- Suporte a cartões de crédito
- Processamento de PIX
- Validação de valores e produtos
- Webhooks para atualização de status

### 📮 **Gestão de Pedidos**
- Criação e rastreamento de pedidos
- Status automatizados (pending → paid → processing → shipped → delivered)
- Histórico completo de pedidos
- Itens do pedido com preços históricos
- Cálculo de frete integrado
- Dashboard administrativo de pedidos

### 🚚 **Frete & Endereços**
- Cálculo de frete via API
- **Múltiplos endereços** por usuário
- Definição de endereço padrão
- Validação de CEP e dados
- Suporte a diferentes transportadoras

### ⭐ **Avaliações & Ratings**
- Sistema de reviews com notas de 1-5
- Comentários em produtos
- Moderação de avaliações (aprovação/rejeição)
- Cálculo automático de média
- Validação: 1 avaliação por usuário/produto
- Filtro de avaliações aprovadas

### 🎟️ **Cupons & Descontos**
- Criação de cupons de desconto
- Tipos: percentual ou valor fixo
- Validação de data de validade
- Limite de uso e compra mínima
- Desconto máximo configurável
- Códigos únicos por cupom

### ❤️ **Lista de Desejos**
- Adicionar/remover produtos favoritos
- Listagem com detalhes completos
- Limpeza de lista
- Validação de duplicatas

### 🏆 **Programa de Fidelidade**
- Sistema de pontos por compras
- Tiers de fidelidade (bronze, silver, gold, platinum)
- Multiplicadores de pontos por tier
- Resgate de pontos para descontos
- Transferência de pontos entre usuários
- Histórico completo de transações
- Conversão: 1 ponto = R$ 0,01 de desconto
- Cálculo automático de tier baseado em pontos

### 📍 **Rastreamento de Pedidos**
- Sistema completo de tracking
- Eventos de rastreamento detalhados
- Códigos de rastreamento por transportadora
- Rastreamento público por código
- Status: order_placed, payment_confirmed, preparing, shipped, in_transit, out_for_delivery, delivered
- Estimativa de entrega
- Estatísticas de tempo médio de entrega
- Criação de eventos em lote (bulk)

### 🔄 **Devolução e Troca**
- Solicitação de devolução ou troca
- Múltiplos itens por solicitação
- Status completos (requested, approved, rejected, received, processing, completed)
- Cálculo automático de reembolso
- Restauração de estoque após conclusão
- Motivos e condições do produto
- Painel admin para aprovação
- Histórico de devoluções por usuário
- Estatísticas de devoluções

### 📸 **Upload de Imagens**
- Upload de imagens de produtos
- Suporte múltiplo (até 10 imagens)
- Validação de tipo (JPEG, PNG, WebP, GIF)
- Limite de tamanho (5MB por imagem)
- Definição de imagem principal
- Estatísticas de armazenamento
- Gerenciamento completo (listar, deletar)
- Storage local com diretório automático

### 💬 **Suporte & Atendimento**
- Sistema de tickets de suporte
- Mensagens em tempo real
- Status (open/pending/resolved/closed)
- Prioridades (low/medium/high/urgent)
- Painel separado admin/customer
- Histórico completo de conversas

### 👨‍💼 **Painel Administrativo**
- Dashboard com estatísticas gerais
- CRUD de produtos e categorias
- Gestão de pedidos e status
- Gerenciamento de usuários
- Controle de roles
- Moderação de avaliações
- Gestão de cupons

### 📊 **Analytics & Relatórios**
- Relatórios de vendas por período
- Top produtos mais vendidos
- Estatísticas por categoria
- Evolução de receita no tempo
- Métricas de clientes (total de pedidos, valor gasto)
- Análise de ticket médio

### 📧 **Notificações**
- E-mails transacionais automatizados
- Confirmação de pedidos
- Atualizações de status
- Recuperação de senha
- Templates HTML profissionais

### 🔄 **Mensageria Assíncrona**
- Kafka para comunicação entre serviços
- Eventos de pedidos (criação, pagamento, status)
- Processamento assíncrono de e-mails
- Escalabilidade horizontal
- Perfis completos de usuário
- Atualização de informações pessoais
- Alteração segura de senha
- Histórico de pedidos

### 🏪 **Gestão de Lojas**
- Cadastro de lojas
- Perfil detalhado com produtos
- Sistema multi-loja

### 📦 **Catálogo de Produtos**
- Listagem com filtros e paginação
- Múltiplas imagens por produto
- Categorização inteligente
- Controle de estoque automático

### 🛒 **Carrinho de Compras**
- Adicionar/remover produtos
- Atualizar quantidades
- Validação de estoque em tempo real
- Cálculo automático de totais
- Persistência no banco de dados
- Contador de itens

### 📦 **Sistema de Pedidos**
- Criação de pedidos com validação
- Cálculo automático de totais
- Controle de estoque em tempo real
- Histórico completo
- Rastreamento de status

### 📮 **Cálculo de Frete**
- Integração com múltiplas transportadoras
- Cálculo baseado em CEP e dimensões
- Opções de entrega (SEDEX, PAC, Expresso)

### 💳 **Pagamentos (PagSeguro)**
- Criação de checkout seguro
- Webhook para notificações
- Acompanhamento de status
- Múltiplos métodos de pagamento

### 📧 **Sistema de E-mails**
- Templates HTML responsivos
- E-mail de boas-vindas
- Confirmação de pedido
- Confirmação de pagamento
- Atualizações de status

### 🔄 **Mensageria Assíncrona (Kafka)**
- Eventos de registro de usuário
- Eventos de criação de pedido
- Eventos de pagamento
- Processamento assíncrono

---

## 🛠️ Stack Tecnológico

<div align="center">

| Categoria | Tecnologias |
|-----------|------------|
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) |
| **Mensageria** | ![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white) |
| **Pagamentos** | ![PagSeguro](https://img.shields.io/badge/PagSeguro-00A859?style=for-the-badge&logo=pagseguro&logoColor=white) |
| **Autenticação** | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) ![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white) |
| **Testes** | ![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white) |
| **Documentação** | ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) |
| **Qualidade** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) |

</div>

---

## 📦 Instalação

### Pré-requisitos

```bash
Node.js >= 20.x
PostgreSQL >= 14.x
Kafka >= 2.8 (opcional)
npm ou yarn
```

### Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/TaviloBreno/webmoveis-ecommerce.git
cd webmoveis-ecommerce
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute as migrations do banco**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Inicie o servidor**
```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000` 🚀

---

## ⚙️ Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/webmoveis_db"

# JWT
JWT_SECRET="your-super-secret-key"
PORT=3000

# Kafka (Opcional)
KAFKA_BROKERS="localhost:9092"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# PagSeguro
PAGSEGURO_EMAIL="your-pagseguro-email"
PAGSEGURO_TOKEN="your-pagseguro-token"
PAGSEGURO_SANDBOX="true"

# URLs
FRONTEND_URL="http://localhost:3001"
API_URL="http://localhost:3000"
```

---

## 📚 Documentação da API

### Swagger UI Interativa

Acesse a documentação completa e interativa em:

```
http://localhost:3000/docs
```

### Principais Endpoints

#### 🔐 Autenticação
```http
POST   /auth/register          # Registrar novo usuário
POST   /auth/login             # Login
```

#### 👤 Usuários (Autenticado)
```http
GET    /users/profile          # Obter perfil
PUT    /users/profile          # Atualizar perfil
PUT    /users/password         # Alterar senha
```

#### 📦 Produtos
```http
GET    /products               # Listar produtos
GET    /products/:id           # Detalhes do produto
```

#### 🗂️ Categorias
```http
GET    /categories             # Listar categorias
```

#### 🛒 Carrinho (Autenticado)
```http
GET    /cart                   # Obter carrinho
GET    /cart/count             # Contador de itens
POST   /cart/items             # Adicionar ao carrinho
PUT    /cart/items/:id         # Atualizar quantidade
DELETE /cart/items/:id         # Remover item
DELETE /cart                   # Limpar carrinho
```

#### 🏪 Lojas
```http
POST   /stores/register        # Registrar loja
GET    /stores                 # Listar lojas
GET    /stores/:id             # Detalhes da loja
```

#### 📮 Frete
```http
POST   /shipping/calculate     # Calcular frete
```

#### 🛒 Pedidos (Autenticado)
```http
POST   /orders                 # Criar pedido
GET    /orders                 # Listar pedidos
GET    /orders/:id             # Detalhes do pedido
```

#### 💳 Pagamentos (Autenticado)
```http
POST   /payments/pagseguro/create         # Criar pagamento
GET    /payments/pagseguro/status         # Status do pagamento
POST   /payments/pagseguro/notification   # Webhook PagSeguro
```

---

## 🧪 Testes

O projeto possui cobertura abrangente de testes unitários:

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes E2E
npm run test:e2e
```

### Cobertura de Testes

- ✅ **49+ testes** passando
- ✅ AuthService (8 testes)
- ✅ UsersService (7 testes)
- ✅ OrdersService (8 testes)
- ✅ CartService (12 testes)
- ✅ EmailService (5 testes)
- ✅ KafkaService (3 testes)
- ✅ PagSeguroService (3 testes)
- ✅ CategoriesService (3 testes)

---

## 🏗️ Arquitetura

```
src/
├── auth/              # Módulo de autenticação
├── users/             # Gestão de usuários
├── products/          # Catálogo de produtos
├── categories/        # Categorias
├── stores/            # Gestão de lojas
├── cart/              # Carrinho de compras
├── orders/            # Sistema de pedidos
├── shipping/          # Cálculo de frete
├── payments/          # Integração pagamentos
├── email/             # Serviço de e-mails
├── kafka/             # Mensageria Kafka
└── prisma.service.ts  # ORM Database
```

---

## 🗄️ Modelagem do Banco de Dados

```mermaid
erDiagram
    User ||--o{ Order : places
    Store ||--o{ Product : has
    Category ||--o{ Product : contains
    Product ||--o{ ProductImage : has
    Order ||--o{ OrderItem : contains
    Product ||--o{ OrderItem : includes
```

---

## 🚀 Deploy

### Docker

```bash
# Build da imagem
docker build -t webmoveis-api .

# Executar container
docker run -p 3000:3000 --env-file .env webmoveis-api
```

### Docker Compose

```bash
docker-compose up -d
```

---

## 📈 Melhorias Futuras

- [ ] Sistema de cache com Redis
- [ ] Rate limiting e throttling
- [ ] Métricas e monitoramento com Prometheus
- [ ] Logs estruturados com Winston
- [ ] GraphQL API
- [ ] Internacionalização (i18n)
- [ ] Sistema de reviews e avaliações
- [ ] Recomendações com ML
- [ ] Dashboard administrativo

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

<div align="center">

### **Tavilo Breno**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TaviloBreno)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tavilo-breno)

**Desenvolvedor Full Stack | Especialista em Backend | Arquitetura de Software**

*Construindo soluções escaláveis e robustas com as melhores tecnologias do mercado*

</div>

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**Desenvolvido com 💜 por [Tavilo Breno](https://github.com/TaviloBreno)**

</div>
