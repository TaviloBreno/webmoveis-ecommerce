# 🛍️ WebMoveis E-commerce - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Novas Funcionalidades](#novas-funcionalidades)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Executar Testes](#executar-testes)
6. [Componentes e Páginas](#componentes-e-páginas)
7. [Sistema de Roles](#sistema-de-roles)

---

## 🎯 Visão Geral

E-commerce completo com frontend Next.js 16 e backend NestJS, incluindo:
- ✅ Design profissional com paleta de cores personalizada
- ✅ Animações com Framer Motion
- ✅ Hero Slider automático
- ✅ Efeito Parallax
- ✅ Sistema de roles (Admin, Employee, Customer)
- ✅ Testes unitários (Jest)
- ✅ Testes E2E (Cypress)
- ✅ Páginas Sobre e Contatos

---

## 🆕 Novas Funcionalidades

### 1. **Página Sobre** (`/sobre`)
- Hero section com imagem do Unsplash
- Estatísticas da empresa (10+ anos, 50k+ clientes, etc)
- Seção de missão com imagem e texto
- 4 valores da empresa (cards animados)
- Grid de equipe com fotos e cargos
- CTA para entrar em contato

### 2. **Página Contatos** (`/contatos`)
- Hero section animado
- 4 cards de informações (telefone, email, endereço, horário)
- Formulário de contato completo com validação
- Mensagem de sucesso após envio
- Seção de FAQ
- Mapa/localização visual

### 3. **Sistema de Roles de Usuário**
- **Admin**: Acesso total ao dashboard admin
- **Employee**: Acesso a funcionalidades de funcionário
- **Customer**: Acesso padrão de cliente

**Componente de Proteção por Role:**
```tsx
<RoleProtectedRoute allowedRoles={["admin"]}>
  {/* Conteúdo apenas para admin */}
</RoleProtectedRoute>
```

### 4. **Dashboard Admin** (`/admin`)
- Estatísticas em tempo real (receita, pedidos, clientes, produtos)
- Ações rápidas (gerenciar produtos, usuários, relatórios)
- Lista de pedidos recentes
- Produtos em destaque
- Cards animados e responsivos

### 5. **Hero Slider**
Slider automático com 4 slides:
- Navegação por setas (esquerda/direita)
- Indicadores de dots
- Drag para trocar de slide
- Auto-play configurável
- Animações suaves com Framer Motion

**Uso:**
```tsx
<HeroSlider slides={heroSlides} autoPlayInterval={6000} />
```

### 6. **Componente Parallax Hero**
Efeito parallax no scroll com:
- Imagem de fundo que se move
- Fade out do conteúdo
- Zoom na imagem
- Configurável altura e conteúdo

**Uso:**
```tsx
<ParallaxHero 
  imageSrc="https://images.unsplash.com/..."
  title="Título"
  subtitle="Subtítulo"
  height="h-96"
/>
```

### 7. **Testes Completos**

#### **Jest (Testes Unitários)**
- ✅ Button component
- ✅ Input component
- ✅ Auth Store (Zustand)
- ✅ Utility functions

#### **Cypress (Testes E2E)**
- ✅ Home page navigation
- ✅ Products page filters
- ✅ Contact form submission
- ✅ About page content
- ✅ Hero slider interaction

---

## 📁 Estrutura do Projeto

```
webmoveis-ecommerce/
├── api/                          # Backend NestJS
│   ├── src/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── ...
│   └── prisma/
│
├── frontend/                     # Frontend Next.js
│   ├── app/
│   │   ├── page.tsx             # Home com Hero Slider
│   │   ├── sobre/page.tsx       # ✨ Nova página Sobre
│   │   ├── contatos/page.tsx    # ✨ Nova página Contatos
│   │   ├── admin/page.tsx       # ✨ Dashboard Admin
│   │   ├── produtos/
│   │   ├── carrinho/
│   │   ├── perfil/
│   │   ├── pedidos/
│   │   ├── login/
│   │   └── registro/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── HeroSlider.tsx        # ✨ Novo
│   │   │   └── ParallaxHero.tsx      # ✨ Novo
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── auth/
│   │       ├── ProtectedRoute.tsx
│   │       └── RoleProtectedRoute.tsx # ✨ Novo
│   │
│   ├── lib/
│   │   ├── store/
│   │   │   ├── auth-store.ts    # ✨ Atualizado com roles
│   │   │   └── cart-store.ts
│   │   ├── api.ts
│   │   └── utils.ts
│   │
│   ├── services/                # API service layers
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   │
│   ├── __tests__/               # ✨ Testes Jest
│   │   ├── components/
│   │   │   ├── Button.test.tsx
│   │   │   └── Input.test.tsx
│   │   └── lib/
│   │       ├── auth-store.test.tsx
│   │       └── utils.test.ts
│   │
│   ├── cypress/                 # ✨ Testes E2E
│   │   ├── e2e/
│   │   │   ├── home.cy.ts
│   │   │   ├── products.cy.ts
│   │   │   ├── contact.cy.ts
│   │   │   └── about.cy.ts
│   │   └── support/
│   │       ├── commands.ts
│   │       └── e2e.ts
│   │
│   ├── jest.config.ts           # ✨ Config Jest
│   ├── jest.setup.ts            # ✨ Setup Jest
│   ├── cypress.config.ts        # ✨ Config Cypress
│   └── package.json
│
└── README.md
```

---

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repo-url>
cd webmoveis-ecommerce
```

### 2. Configure o Backend (API)
```bash
cd api
npm install

# Configure o .env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor
npm run start:dev
```

### 3. Configure o Frontend
```bash
cd frontend
npm install

# Configure o .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

---

## 🧪 Executar Testes

### Testes Unitários (Jest)
```bash
cd frontend

# Modo watch (desenvolvimento)
npm test

# Executar todos os testes
npm run test:ci

# Com cobertura
npm test -- --coverage
```

### Testes E2E (Cypress)

**Interface Gráfica:**
```bash
cd frontend
npm run cypress
```

**Modo Headless:**
```bash
npm run cypress:headless
```

**Com servidor automático:**
```bash
# Inicia o dev server e executa os testes
npm run e2e

# Modo headless
npm run e2e:headless
```

---

## 🎨 Componentes e Páginas

### HeroSlider
Slider de imagens com auto-play e navegação.

**Props:**
- `slides`: Array de objetos com id, image, title, subtitle, cta
- `autoPlayInterval`: Tempo em ms entre slides (padrão: 5000)

**Exemplo:**
```tsx
const slides = [
  {
    id: 1,
    image: "url-da-imagem",
    title: "Título do Slide",
    subtitle: "Subtítulo",
    cta: {
      text: "Ver Mais",
      link: "/produtos"
    }
  }
];

<HeroSlider slides={slides} autoPlayInterval={6000} />
```

### ParallaxHero
Hero section com efeito parallax.

**Props:**
- `imageSrc`: URL da imagem de fundo
- `title`: Título principal
- `subtitle`: Subtítulo (opcional)
- `height`: Classe Tailwind de altura (padrão: "h-96")

### RoleProtectedRoute
Protege rotas por role de usuário.

**Props:**
- `allowedRoles`: Array de roles permitidas
- `fallbackUrl`: URL de redirecionamento (padrão: "/perfil")

**Exemplo:**
```tsx
<RoleProtectedRoute allowedRoles={["admin", "employee"]}>
  <ConteudoProtegido />
</RoleProtectedRoute>
```

---

## 👥 Sistema de Roles

### Tipos de Usuário

1. **Admin**
   - Acesso ao `/admin` dashboard
   - Gerenciar produtos, usuários, pedidos
   - Ver relatórios e estatísticas

2. **Employee**
   - Acesso a funcionalidades de funcionário
   - Gerenciar pedidos
   - Atendimento ao cliente

3. **Customer** (padrão)
   - Comprar produtos
   - Ver pedidos
   - Gerenciar perfil

### Como verificar role no código

**No componente:**
```tsx
const { user } = useAuthStore();

if (user?.role === 'admin') {
  // Mostrar funcionalidades admin
}
```

**No auth-store:**
```tsx
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee" | "customer";
}
```

---

## 🎨 Paleta de Cores

### Primary (Azul)
- `primary-50` até `primary-900`
- Base: `#0ea5e9`

### Secondary (Violeta)
- `secondary-50` até `secondary-900`
- Base: `#a855f7`

### Accent (Verde)
- `accent-50` até `accent-900`
- Base: `#10b981`

### Neutral (Cinza)
- `neutral-50` até `neutral-900`

### Classes Utilitárias
- `.gradient-primary` - Gradiente primário
- `.gradient-secondary` - Gradiente secundário
- `.gradient-accent` - Gradiente accent
- `.glass-effect` - Efeito glass morphism

---

## 📝 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm test             # Testes Jest (watch)
npm run test:ci      # Testes Jest (CI)
npm run cypress      # Cypress UI
npm run e2e          # E2E com servidor automático
```

### Backend
```bash
npm run start:dev    # Servidor de desenvolvimento
npm run build        # Build
npm run start:prod   # Produção
npm test             # Testes unitários
npm run test:e2e     # Testes E2E
```

---

## 🌟 Recursos Adicionais

- **Imagens**: Integração com Unsplash
- **Animações**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: Zustand com persist
- **HTTP**: Axios com interceptors
- **Styling**: Tailwind CSS com custom config

---

## 📞 Suporte

Para dúvidas ou problemas, acesse:
- Página de Contatos: `/contatos`
- Email: contato@webmoveis.com
- Telefone: (11) 3456-7890

---

## 📄 Licença

Este projeto é propriedade privada.

---

**Desenvolvido com ❤️ pela equipe WebMoveis**
