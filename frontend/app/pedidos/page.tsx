"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { orderService } from "@/services/order.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, Eye } from "lucide-react";
import Link from "next/link";

export default function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendente",
      confirmed: "Confirmado",
      processing: "Processando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Você ainda não fez nenhum pedido
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece a comprar e seus pedidos aparecerão aqui
                </p>
                <Link
                  href="/produtos"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Ver Produtos
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Pedido #{order.id}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-semibold text-lg">
                            {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pagamento</p>
                          <p className="font-medium">{order.payment_method}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Itens</p>
                          <p className="font-medium">
                            {order.items?.length || 0} produtos
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href={`/pedidos/${order.id}`}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Eye size={18} />
                          <span>Ver Detalhes</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
