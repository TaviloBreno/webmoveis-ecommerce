"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { cartService } from "@/services/cart.service";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
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
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-600 mb-6">
                  Adicione produtos ao carrinho para continuar comprando
                </p>
                <Link href="/produtos">
                  <Button>Ver Produtos</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <div className="flex items-center space-x-4 p-4">
                      <div className="relative w-24 h-24 bg-gray-200 flex-shrink-0">
                        {item.product.images?.[0]?.url && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {formatCurrency(item.product.price)} cada
                        </p>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={updating === item.id}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updating === item.id}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updating === item.id}
                            className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Remover</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button variant="outline" onClick={handleClearCart} className="w-full">
                  Limpar Carrinho
                </Button>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-6">Resumo do Pedido</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Frete</span>
                        <span className="text-green-600">Calcular no checkout</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-blue-600">{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => router.push("/checkout")}
                    >
                      Finalizar Compra
                    </Button>

                    <Link href="/produtos">
                      <Button variant="ghost" className="w-full mt-3">
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
