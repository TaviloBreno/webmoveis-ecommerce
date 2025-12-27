"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ParallaxHero from "@/components/ui/ParallaxHero";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Heart, Filter, Grid, List, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProdutosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { updateItemCount } = useCartStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    search: searchParams?.get("search") || "",
    min_price: "",
    max_price: "",
    sort_by: "newest" as any,
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        ...filters,
        min_price: filters.min_price ? parseFloat(filters.min_price) : undefined,
        max_price: filters.max_price ? parseFloat(filters.max_price) : undefined,
        limit: 20,
      });
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      await cartService.addToCart(productId, 1);
      const count = await cartService.getCartCount();
      updateItemCount(count.count || 0);
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar ao carrinho");
    }
  };

  return (
    <Layout>
      {/* Hero Section with Parallax */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
        title="Nossos Produtos"
        subtitle="Explore nossa coleção com os melhores produtos do mercado"
        height="h-[400px]"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-neutral-600">
              {loading ? "Carregando..." : `${products.length} produtos encontrados`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" 
                  ? "bg-primary-100 text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" 
                  ? "bg-primary-100 text-primary-600 shadow-sm" 
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter size={20} className="text-primary-600" />
                <h3 className="font-semibold text-lg">Filtros</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Preço mínimo"
                  value={filters.min_price}
                  onChange={(e) =>
                    setFilters({ ...filters, min_price: e.target.value })
                  }
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Preço máximo"
                  value={filters.max_price}
                  onChange={(e) =>
                    setFilters({ ...filters, max_price: e.target.value })
                  }
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <select
                  value={filters.sort_by}
                  onChange={(e) =>
                    setFilters({ ...filters, sort_by: e.target.value as any })
                  }
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                  <option value="name">Nome A-Z</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-neutral-600 text-lg">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-600 text-xl">Nenhum produto encontrado</p>
            <p className="text-neutral-500 mt-2">Tente ajustar os filtros</p>
          </div>
        ) : (
          <motion.div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card hover className="h-full">
                  {viewMode === "grid" ? (
                    <div className="h-full flex flex-col">
                      <Link href={`/produtos/${product.id}`}>
                        <div className="relative h-56 bg-neutral-200 group overflow-hidden">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <Image
                              src={`https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&q=80&w=500`}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-3 right-3">
                            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all hover:scale-110">
                              <Heart size={18} className="text-red-500" />
                            </button>
                          </div>
                          {product.discount && (
                            <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              -{product.discount}%
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4 flex-1 flex flex-col">
                        <Link href={`/produtos/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-neutral-600 text-sm mb-3 line-clamp-2 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                            />
                          ))}
                          <span className="text-sm text-neutral-600 ml-2">(4.0)</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            {product.discount && (
                              <span className="text-sm text-neutral-400 line-through block">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                            <span className="text-2xl font-bold text-primary-600">
                              {formatCurrency(product.price * (product.discount ? (100 - product.discount) / 100 : 1))}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product.id)}
                            className="shadow-md hover:shadow-lg"
                          >
                            <ShoppingCart size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex p-4 space-x-4">
                      <Link href={`/produtos/${product.id}`}>
                        <div className="relative w-40 h-40 bg-neutral-200 flex-shrink-0 rounded-lg overflow-hidden group">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <Image
                              src={`https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&q=80&w=400`}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between">
                          <Link href={`/produtos/${product.id}`}>
                            <h3 className="font-semibold text-xl mb-2 hover:text-primary-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <button className="hover:scale-110 transition-transform">
                            <Heart size={20} className="text-red-500" />
                          </button>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                            />
                          ))}
                          <span className="text-sm text-neutral-600 ml-2">(4.0)</span>
                        </div>
                        <p className="text-neutral-600 text-sm mb-4 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            {product.discount && (
                              <span className="text-sm text-neutral-400 line-through block">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                            <span className="text-3xl font-bold text-primary-600">
                              {formatCurrency(product.price * (product.discount ? (100 - product.discount) / 100 : 1))}
                            </span>
                          </div>
                          <Button onClick={() => handleAddToCart(product.id)} className="shadow-md hover:shadow-lg">
                            <ShoppingCart size={18} className="mr-2" />
                            Adicionar ao Carrinho
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
