"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { wishlistService, WishlistItem } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingCart, Trash2, Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const { removeFromWishlistStore, setWishlistCount } = useWishlistStore();
  const { updateItemCount } = useCartStore();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setItems(data);
      setWishlistCount(data.length);
    } catch (error) {
      console.error("Erro ao carregar wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    if (processingIds.has(productId)) return;

    setProcessingIds((prev) => new Set(prev).add(productId));

    try {
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      removeFromWishlistStore(productId);
      setWishlistCount(items.length - 1);
    } catch (error) {
      console.error("Erro ao remover da wishlist:", error);
      alert("Erro ao remover produto da lista de desejos");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (processingIds.has(productId)) return;

    setProcessingIds((prev) => new Set(prev).add(productId));

    try {
      await cartService.addToCart(productId, 1);
      const count = await cartService.getCartCount();
      updateItemCount(count.count || 0);

      // Remove da wishlist após adicionar ao carrinho
      await handleRemove(productId);
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar produto ao carrinho");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Deseja realmente limpar toda a lista de desejos?")) return;

    setLoading(true);
    try {
      await wishlistService.clearWishlist();
      setItems([]);
      setWishlistCount(0);
    } catch (error) {
      console.error("Erro ao limpar wishlist:", error);
      alert("Erro ao limpar lista de desejos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Heart className="mx-auto text-white mb-4" size={48} />
              <h1 className="text-4xl font-bold text-white mb-2">
                Lista de Desejos
              </h1>
              <p className="text-white/90 text-lg">
                {items.length} {items.length === 1 ? "produto salvo" : "produtos salvos"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {items.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-neutral-400" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Sua lista está vazia
              </h2>
              <p className="text-neutral-600 mb-8">
                Explore nossos produtos e adicione seus favoritos aqui
              </p>
              <Button asChild>
                <Link href="/produtos">Ver Produtos</Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Header Actions */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Meus Favoritos
                </h2>
                {items.length > 0 && (
                  <Button variant="outline" onClick={handleClearAll}>
                    <Trash2 size={16} className="mr-2" />
                    Limpar Tudo
                  </Button>
                )}
              </div>

              {/* Items Grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {items.map((item) => (
                  <motion.div key={item.id} variants={fadeInUp}>
                    <Card hover className="h-full group">
                      <div className="relative">
                        {/* Product Image */}
                        <Link href={`/produtos/${item.product.id}`}>
                          <div className="relative h-64 bg-neutral-200 rounded-lg overflow-hidden mb-4">
                            <Image
                              src={
                                item.product.imageUrl ||
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {!item.product.inStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="bg-white text-neutral-900 px-4 py-2 rounded-lg font-semibold">
                                  Fora de Estoque
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          disabled={processingIds.has(item.product.id)}
                          className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors z-10"
                        >
                          {processingIds.has(item.product.id) ? (
                            <Loader2 className="animate-spin text-red-600" size={20} />
                          ) : (
                            <Heart className="text-red-600 fill-red-600" size={20} />
                          )}
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <Link href={`/produtos/${item.product.id}`}>
                          <h3 className="font-semibold text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>

                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-primary-600">
                            {formatCurrency(item.product.price)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          {item.product.inStock ? (
                            <>
                              <Button
                                onClick={() => handleAddToCart(item.product.id)}
                                disabled={processingIds.has(item.product.id)}
                                className="flex-1"
                                size="sm"
                              >
                                {processingIds.has(item.product.id) ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <>
                                    <ShoppingCart size={16} className="mr-2" />
                                    Adicionar
                                  </>
                                )}
                              </Button>
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Link href={`/produtos/${item.product.id}`}>
                                  Ver Detalhes
                                </Link>
                              </Button>
                            </>
                          ) : (
                            <Button disabled className="flex-1" size="sm">
                              <Package size={16} className="mr-2" />
                              Indisponível
                            </Button>
                          )}
                        </div>

                        {/* Added Date */}
                        <p className="text-xs text-neutral-500">
                          Adicionado em{" "}
                          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center"
              >
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Encontrou o que procurava?
                </h3>
                <p className="text-neutral-600 mb-6">
                  Continue explorando nossa loja e descubra mais produtos incríveis
                </p>
                <Button asChild size="lg">
                  <Link href="/produtos">
                    <ShoppingCart size={20} className="mr-2" />
                    Continuar Comprando
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
