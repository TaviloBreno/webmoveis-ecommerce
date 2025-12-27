# Credenciais de Teste - WebMóveis E-commerce

## Usuários para Testes

### Administrador
- **Email:** admin@webmoveis.com
- **Senha:** admin123
- **Permissões:** Acesso total ao sistema, dashboard administrativo, gerenciamento de produtos e usuários
- **Dashboard:** http://localhost:3000/admin

### Funcionário
- **Email:** func@webmoveis.com
- **Senha:** func123
- **Permissões:** Gerenciamento de pedidos, atendimento ao cliente
- **Dashboard:** http://localhost:3000/funcionario

### Cliente
- **Email:** cliente@webmoveis.com  
- **Senha:** cliente123
- **Permissões:** Acesso padrão de cliente, compras, visualização de pedidos
- **Dashboard:** http://localhost:3000/perfil

---

## Recursos Implementados

### ✅ Efeito Parallax
O efeito parallax está implementado nas seguintes páginas:
- **Sobre** (`/sobre`) - Hero com parallax scroll
- **Contatos** (`/contatos`) - Hero com parallax scroll  
- **Produtos** (`/produtos`) - Hero com parallax scroll

O componente `ParallaxHero` utiliza:
- `framer-motion` para animações suaves
- `useScroll` para detectar scroll da página
- `useTransform` para criar o efeito de profundidade
- Background se move 50% mais devagar que o scroll
- Fade out do conteúdo conforme rola

### 🎨 Design Profissional
- Imagens do Unsplash em alta qualidade
- Sistema de cores customizado com CSS variables
- Animações de scroll com Framer Motion
- Glass morphism effects
- Gradientes personalizados

### 🛒 E-commerce Completo
- Listagem de produtos com filtros
- Página de detalhes do produto com galeria de imagens
- Carrinho de compras
- Sistema de autenticação
- Gestão de pedidos
- **Dashboards diferenciadas por role:**
  - Admin: Estatísticas, gestão de pedidos, usuários e produtos
  - Funcionário: Gerenciamento de pedidos e tickets de suporte
  - Cliente: Pedidos, wishlist, fidelidade e benefícios

### 🎠 Hero Slider
- Slider automático na página inicial
- 4 slides com transições suaves
- Navegação por setas e indicadores
- Funcionalidade de arrastar

### 🧪 Testes
- **Jest** - Testes unitários
- **Cypress** - Testes E2E

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar testes
npm test              # Jest
npm run e2e          # Cypress

# Build para produção  
npm run build
npm start
```

## Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **React Hook Form** - Formulários
- **Zod** - Validação

---

**Nota:** As credenciais acima são apenas para ambiente de testes e demonstração.
