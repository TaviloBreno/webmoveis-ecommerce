import { PrismaClient } from '@prisma/client';

interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  images: string[];
}

const productsToInsert: ProductData[] = [
  // SOFÁS E POLTRONAS
  {
    name: 'Sofá 3 Lugares Retrátil e Reclinável',
    description: 'Sofá moderno com mecanismo retrátil e reclinável, perfeito para sala de estar. Revestimento em tecido suede de alta qualidade, estrutura de madeira maciça e espuma de alta densidade para máximo conforto. Assento com molas ensacadas individuais.',
    price: 2499.90,
    stock: 15,
    categoryName: 'Sofás e Poltronas',
    weight: 85.5,
    width: 230,
    height: 95,
    length: 105,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    ],
  },
  {
    name: 'Poltrona Charles Eames Design',
    description: 'Poltrona clássica inspirada no design de Charles Eames. Base giratória em alumínio polido, estofado em couro sintético premium. Perfeita para ambientes modernos e sofisticados.',
    price: 1299.00,
    stock: 25,
    categoryName: 'Sofás e Poltronas',
    weight: 25,
    width: 82,
    height: 82,
    length: 85,
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    ],
  },
  {
    name: 'Sofá Chaise 4 Lugares com Almofadas',
    description: 'Sofá amplo com chaise para maior conforto. Inclui almofadas decorativas, revestimento em linho texturizado resistente. Design contemporâneo que se adapta a diversos estilos.',
    price: 3299.00,
    stock: 8,
    categoryName: 'Sofás e Poltronas',
    weight: 95,
    width: 280,
    height: 90,
    length: 170,
    images: [
      'https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800&q=80',
      'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80',
    ],
  },

  // MESAS
  {
    name: 'Mesa de Jantar Extensível 6-8 Lugares',
    description: 'Mesa de jantar versátil com tampo extensível em MDF revestido. Estrutura robusta em madeira maciça, acabamento em verniz brilhante. Acompanha sistema de extensão prático e seguro.',
    price: 1899.00,
    stock: 12,
    categoryName: 'Mesas',
    weight: 62,
    width: 160,
    height: 75,
    length: 90,
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
  },
  {
    name: 'Mesa de Centro com Gavetas',
    description: 'Mesa de centro funcional com duas gavetas para armazenamento. Tampo em vidro temperado, estrutura em madeira com acabamento laminado. Design minimalista e prático.',
    price: 599.90,
    stock: 30,
    categoryName: 'Mesas',
    weight: 28,
    width: 120,
    height: 40,
    length: 60,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
      'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800&q=80',
    ],
  },
  {
    name: 'Mesa Lateral Industrial com Rodízios',
    description: 'Mesa lateral estilo industrial com estrutura em aço e tampo em madeira rústica. Rodízios com trava para mobilidade. Perfeita como apoio ou mesa de canto.',
    price: 449.00,
    stock: 20,
    categoryName: 'Mesas',
    weight: 15,
    width: 50,
    height: 55,
    length: 50,
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
    ],
  },

  // CADEIRAS
  {
    name: 'Conjunto 4 Cadeiras Estofadas para Jantar',
    description: 'Set com 4 cadeiras elegantes estofadas em tecido veludo. Estrutura em madeira maciça, assento acolchoado com espuma de alta densidade. Perfeitas para complementar sua mesa de jantar.',
    price: 1199.00,
    stock: 18,
    categoryName: 'Cadeiras',
    weight: 32,
    width: 48,
    height: 95,
    length: 56,
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80',
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80',
    ],
  },
  {
    name: 'Cadeira Office Ergonômica Premium',
    description: 'Cadeira de escritório com design ergonômico, ajuste de altura a gás, apoio lombar ajustável, braços 3D reguláveis. Revestimento em couro sintético respirável, base giratória com 5 rodízios.',
    price: 899.90,
    stock: 35,
    categoryName: 'Cadeiras',
    weight: 18,
    width: 65,
    height: 120,
    length: 65,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
    ],
  },
  {
    name: 'Banqueta Alta para Cozinha Americana',
    description: 'Banqueta moderna com assento giratório e apoio para os pés. Estrutura metálica cromada, assento estofado em corino. Regulagem de altura a gás.',
    price: 329.00,
    stock: 40,
    categoryName: 'Cadeiras',
    weight: 8,
    width: 40,
    height: 95,
    length: 40,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    ],
  },

  // CAMAS E COLCHÕES
  {
    name: 'Cama Box Queen Size com Baú',
    description: 'Cama box queen com baú espaçoso para armazenamento. Colchão de molas ensacadas, travesseiros de brinde. Revestimento em suede de alta qualidade. Conjunto completo e funcional.',
    price: 2199.00,
    stock: 10,
    categoryName: 'Camas e Colchões',
    weight: 85,
    width: 158,
    height: 60,
    length: 198,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
    ],
  },
  {
    name: 'Cabeceira Estofada King Size',
    description: 'Cabeceira elegante estofada em tecido linho, estrutura em MDF de alta densidade. Design capitonê clássico com botões cristal. Fácil instalação.',
    price: 699.00,
    stock: 22,
    categoryName: 'Camas e Colchões',
    weight: 25,
    width: 195,
    height: 130,
    length: 10,
    images: [
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80',
    ],
  },
  {
    name: 'Colchão Casal Molas Ensacadas Premium',
    description: 'Colchão de alta qualidade com sistema de molas ensacadas individuais, camadas de espuma viscoelástica, tecido antialérgico e antiácaro. Proporciona conforto e suporte ideais.',
    price: 1599.00,
    stock: 15,
    categoryName: 'Camas e Colchões',
    weight: 42,
    width: 138,
    height: 30,
    length: 188,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    ],
  },

  // ESTANTES E ARMÁRIOS
  {
    name: 'Estante Modular para Livros 5 Prateleiras',
    description: 'Estante versátil com 5 prateleiras ajustáveis. Estrutura em MDF com acabamento BP. Design clean e funcional, perfeita para organizar livros, decorações e objetos.',
    price: 799.00,
    stock: 25,
    categoryName: 'Estantes e Armários',
    weight: 35,
    width: 80,
    height: 180,
    length: 30,
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
  },
  {
    name: 'Guarda-Roupa 3 Portas com Espelho',
    description: 'Guarda-roupa amplo com 3 portas de correr, sendo uma com espelho. Interior com cabideiro, prateleiras e gavetas. Estrutura robusta em MDP de 15mm.',
    price: 1899.00,
    stock: 8,
    categoryName: 'Estantes e Armários',
    weight: 98,
    width: 270,
    height: 220,
    length: 65,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
  },
  {
    name: 'Rack para TV até 65 polegadas',
    description: 'Rack moderno com nichos e gavetas para organização. Suporta TVs de até 65 polegadas. Painel para fixação da TV, acabamento em BP fosco.',
    price: 899.00,
    stock: 18,
    categoryName: 'Estantes e Armários',
    weight: 45,
    width: 180,
    height: 180,
    length: 40,
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
    ],
  },

  // DECORAÇÃO
  {
    name: 'Kit 3 Quadros Decorativos Abstratos',
    description: 'Conjunto com 3 quadros em canvas com impressão de alta qualidade. Moldura em madeira com acabamento laqueado. Tema abstrato moderno em tons neutros.',
    price: 299.00,
    stock: 50,
    categoryName: 'Decoração',
    weight: 3,
    width: 60,
    height: 80,
    length: 3,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
      'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&q=80',
    ],
  },
  {
    name: 'Espelho Redondo Decorativo 80cm',
    description: 'Espelho decorativo redondo com moldura em metal dourado. Acabamento premium, vidro bisotado de 5mm. Peça sofisticada para valorizar qualquer ambiente.',
    price: 449.00,
    stock: 30,
    categoryName: 'Decoração',
    weight: 8,
    width: 80,
    height: 80,
    length: 3,
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
    ],
  },
  {
    name: 'Vasos Decorativos Cerâmica Kit 3 Peças',
    description: 'Trio de vasos em cerâmica com acabamento artesanal. Tamanhos variados para composição. Cores neutras que combinam com diversos estilos de decoração.',
    price: 189.00,
    stock: 45,
    categoryName: 'Decoração',
    weight: 4,
    width: 25,
    height: 35,
    length: 25,
    images: [
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80',
    ],
  },

  // ESCRITÓRIO
  {
    name: 'Mesa Escrivaninha Home Office com Gavetas',
    description: 'Escrivaninha funcional com 3 gavetas para organização. Tampo espaçoso em MDP, passa-cabos integrado. Design moderno e prático para trabalho remoto.',
    price: 699.00,
    stock: 28,
    categoryName: 'Escritório',
    weight: 32,
    width: 120,
    height: 75,
    length: 60,
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
  },
  {
    name: 'Estação de Trabalho em L com Suporte Monitor',
    description: 'Mesa em L para aproveitar cantos. Suporte regulável para monitor, organizador de cabos, superfície ampla. Ideal para setup profissional.',
    price: 1299.00,
    stock: 15,
    categoryName: 'Escritório',
    weight: 48,
    width: 150,
    height: 75,
    length: 150,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
    ],
  },
  {
    name: 'Gaveteiro Móvel 3 Gavetas com Chave',
    description: 'Gaveteiro compacto com rodízios. 3 gavetas com corrediças metálicas, trava de segurança. Perfeito para complementar mesa de escritório.',
    price: 399.00,
    stock: 35,
    categoryName: 'Escritório',
    weight: 18,
    width: 40,
    height: 60,
    length: 50,
    images: [
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
    ],
  },

  // ILUMINAÇÃO
  {
    name: 'Lustre Pendente Moderno 5 Lâmpadas',
    description: 'Lustre pendente com design contemporâneo. Estrutura metálica preta fosca, suporte para 5 lâmpadas E27. Inclui canopla e cabo regulável até 100cm.',
    price: 549.00,
    stock: 20,
    categoryName: 'Iluminação',
    weight: 4.5,
    width: 80,
    height: 120,
    length: 80,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      'https://images.unsplash.com/photo-1565824686803-a15999b4c5f1?w=800&q=80',
    ],
  },
  {
    name: 'Luminária de Piso Trípé Design',
    description: 'Luminária de chão com base trípé em madeira natural. Cúpula em tecido bege, acabamento premium. Design escandinavo minimalista.',
    price: 389.00,
    stock: 25,
    categoryName: 'Iluminação',
    weight: 5,
    width: 50,
    height: 160,
    length: 50,
    images: [
      'https://images.unsplash.com/photo-1550278043-e3e8c962d65a?w=800&q=80',
    ],
  },
  {
    name: 'Arandela LED Moderna para Parede',
    description: 'Arandela em alumínio com LED integrado 12W. Luz branca neutra 4000K, design minimalista. Bivolt automático, baixo consumo de energia.',
    price: 189.00,
    stock: 60,
    categoryName: 'Iluminação',
    weight: 0.8,
    width: 20,
    height: 15,
    length: 10,
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
    ],
  },
];

export async function seedProducts() {
  const prisma = new PrismaClient();
  
  console.log('📦 Criando produtos...');
  
  // Busca a loja padrão
  const store = await prisma.store.findFirst();
  
  if (!store) {
    console.error('❌ Nenhuma loja encontrada. Execute seedStores() primeiro.');
    await prisma.$disconnect();
    return;
  }
  
  for (const productData of productsToInsert) {
    // Busca a categoria pelo nome
    const category = await prisma.category.findFirst({
      where: { name: productData.categoryName },
    });
    
    if (!category) {
      console.warn(`⚠️  Categoria não encontrada: ${productData.categoryName}`);
      continue;
    }
    
    // Verifica se o produto já existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: productData.name,
      },
    });
    
    if (existingProduct) {
      console.log(`ℹ️  Produto já existe: ${productData.name}`);
      continue;
    }
    
    // Cria o produto
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        weight: productData.weight,
        width: productData.width,
        height: productData.height,
        length: productData.length,
        category_id: category.id,
        store_id: store.id,
      },
    });
    
    // Cria as imagens do produto
    for (let i = 0; i < productData.images.length; i++) {
      await prisma.productImage.create({
        data: {
          product_id: product.id,
          image_url: productData.images[i],
          is_primary: i === 0, // Primeira imagem é a principal
        },
      });
    }
    
    console.log(`✅ Produto criado: ${productData.name}`);
  }
  
  await prisma.$disconnect();
}
