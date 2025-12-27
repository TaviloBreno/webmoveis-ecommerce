"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { cartService } from "@/services/cart.service";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Shield, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, total, setCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.items || [], data.total || 0);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await cartService.updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm("Deseja remover este item do carrinho?")) return;
    setUpdating(itemId);
    try {
      await cartService.removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm("Deseja limpar todo o carrinho?")) return;
    setLoading(true);
    try {
      await cartService.clearCart();
      await loadCart();
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-r from-primary-600 to-secondary-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">Carrinho de Compras</h1>
              <p className="text-white/90">Revise seus itens antes de finalizar</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
              <p className="mt-4 text-neutral-600">Carregando carrinho...</p>
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="max-w-2xl mx-auto">
                <div className="text-center py-16 px-6">
                  <div className="relative w-64 h-64 mx-auto mb-6">
                    <Image
                      src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=500"
                      alt="Carrinho vazio"
                      fill
                      className="object-cover rounded-lg opacity-50"
                    />
                  </div>
                  <ShoppingBag size={64} className="mx-auto text-primary-300 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h3>
                  <p className="text-neutral-600 mb-8">
                    Adicione produtos ao carrinho para continuar comprando
                  </p>
                  <Link href="/produtos">
                    <Button size="lg" className="shadow-lg">
                      <Package className="mr-2" size={20} />
                      Ver Produtos
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  className="space-y-4"
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
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <Card hover>
                        <div className="flex items-center space-x-4 p-6">
                          <div className="relative w-28 h-28 bg-neutral-200 flex-shrink-0 rounded-lg overflow-hidden group">
                            {item.product.images?.[0]?.url ? (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <Image
                                src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300`}
                                alt={item.product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1 text-neutral-800">
                              {item.product.name}
                            </h3>
                            <p className="text-neutral-600 text-sm mb-3">
                              {formatCurrency(item.product.price)} cada
                            </p>

                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 bg-neutral-100 rounded-lg p-1">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={updating === item.id}
                                  className="p-2 hover:bg-white rounded transition-colors"
                                >
                                  <Minus size={16} className="text-primary-600" />
                                </button>
                                <span className="font-semibold w-10 text-center text-neutral-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={updating === item.id}
                                  className="p-2 hover:bg-white rounded transition-colors"
                                >
                                  <Plus size={16} className="text-primary-600" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={updating === item.id}
                                className="text-red-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
                              >
                                <Trash2 size={18} />
                                <span className="text-sm font-medium">Remover</span>
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={handleClearCart} 
                    className="w-full mt-6 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Limpar Carrinho
                  </Button>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="sticky top-24">
                  <Card className="shadow-xl">
                    <div className="p-6 gradient-primary rounded-t-xl">
                      <h3 className="text-2xl font-bold text-white">Resumo do Pedido</h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-neutral-700">
                          <span className="font-medium">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                          <span className="font-semibold">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-700">
                          <span className="font-medium">Frete</span>
                          <span className="text-accent-600 font-semibold">Grátis</span>
                        </div>
                        <div className="border-t border-neutral-200 pt-4">
                          <div className="flex justify-between text-xl font-bold">
                            <span className="text-neutral-900">Total</span>
                            <span className="text-primary-600">{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full mb-3 shadow-lg hover:shadow-xl"
                        size="lg"
                        onClick={() => router.push("/checkout")}
                      >
                        Finalizar Compra
                        <ArrowRight className="ml-2" size={20} />
                      </Button>

                      <Link href="/produtos">
                        <Button variant="ghost" className="w-full">
                          Continuar Comprando
                        </Button>
                      </Link>

                      <div className="mt-6 pt-6 border-t border-neutral-200">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Shield size={16} className="mr-2 text-accent-600" />
                            <span>Compra 100% segura</span>
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <TrendingUp size={16} className="mr-2 text-accent-600" />
                            <span>Frete grátis acima de R$ 200</span>
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <Package size={16} className="mr-2 text-accent-600" />
                            <span>Entrega em até 7 dias úteis</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
