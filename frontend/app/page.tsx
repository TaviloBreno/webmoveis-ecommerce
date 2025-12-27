"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, TrendingUp, Shield, Truck, Star, ArrowRight, Package, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="Shopping Background"
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-4">
                <span className="inline-block px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-semibold">
                  ✨ Novidade: Frete Grátis acima de R$ 200
                </span>
              </motion.div>
              
              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight"
              >
                Sua Loja Online
                <span className="block text-accent-400">de Confiança</span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed"
              >
                Encontre os melhores produtos com preços incríveis. 
                Entrega rápida e segura para todo o Brasil.
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link href="/produtos">
                  <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white shadow-xl group">
                    <ShoppingBag className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                    Começar a Comprar
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary-600 backdrop-blur-sm">
                    Criar Conta Grátis
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 grid grid-cols-3 gap-6 max-w-xl"
              >
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">10k+</div>
                  <div className="text-gray-300 text-sm">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">50k+</div>
                  <div className="text-gray-300 text-sm">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1">4.9</div>
                  <div className="text-gray-300 text-sm flex items-center justify-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    Avaliação
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--bg-primary)"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Truck,
                title: "Entrega Rápida",
                description: "Frete expresso para todo o Brasil",
                color: "text-primary-600",
                bg: "bg-primary-50"
              },
              {
                icon: Shield,
                title: "Compra Segura",
                description: "Proteção total em suas compras",
                color: "text-accent-600",
                bg: "bg-accent-50"
              },
              {
                icon: CreditCard,
                title: "Parcele sem Juros",
                description: "Em até 12x no cartão de crédito",
                color: "text-secondary-600",
                bg: "bg-secondary-50"
              },
              {
                icon: Package,
                title: "Troca Grátis",
                description: "30 dias para trocar ou devolver",
                color: "text-yellow-600",
                bg: "bg-yellow-50"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bg} ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-neutral-900">
              Categorias Populares
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Explore nossa seleção de produtos organizados por categoria
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                name: "Eletrônicos",
                image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
                count: "2.5k produtos"
              },
              {
                name: "Moda",
                image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
                count: "3.2k produtos"
              },
              {
                name: "Casa & Decoração",
                image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
                count: "1.8k produtos"
              },
              {
                name: "Esportes",
                image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
                count: "1.5k produtos"
              }
            ].map((category, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link
                  href={`/produtos?categoria=${category.name.toLowerCase()}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-64">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-300 text-sm">{category.count}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2 text-neutral-900">Produtos em Destaque</h2>
              <p className="text-neutral-600">Selecionados especialmente para você</p>
            </div>
            <Link href="/produtos" className="hidden md:block">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4].map((item) => (
              <motion.div key={item} variants={fadeInUp}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative h-64">
                    <Image
                      src={`https://images.unsplash.com/photo-${
                        item === 1 ? '1523275335684-37898b6baf30' :
                        item === 2 ? '1572635196237-14b3f281503f' :
                        item === 3 ? '1505740420928-5e560c06d30e' :
                        '1542291026-7eec264c27ff'
                      }?w=600&q=80`}
                      alt="Product"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        -20%
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-neutral-600 ml-2">(128)</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-neutral-900 line-clamp-2">
                      Produto Premium de Alta Qualidade
                    </h3>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-2xl font-bold text-primary-600">R$ 299</span>
                      <span className="text-sm text-neutral-500 line-through">R$ 399</span>
                    </div>
                    <Button className="w-full" size="sm">
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
            alt="CTA Background"
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 gradient-primary opacity-90"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Pronto para Começar?
          </h2>
          <p className="text-xl lg:text-2xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Cadastre-se agora e ganhe <strong className="text-accent-400">10% de desconto</strong> na primeira compra
          </p>
          <Link href="/registro">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-100 shadow-xl group">
              Criar Conta Grátis
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <p className="text-neutral-600 mb-8 text-lg">Empresas que confiam em nós</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-4xl font-bold text-neutral-400">
                  BRAND {i}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
