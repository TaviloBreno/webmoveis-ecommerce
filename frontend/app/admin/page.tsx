"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/perfil');
      return;
    }
    setLoading(false);
  }, [user, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Dados mockados - em produção viriam da API
  const stats = {
    revenue: 'R$ 52.840',
    orders: 342,
    customers: 1.258,
    products: 156,
  };

  const recentOrders = [
    { id: 1, customer: 'João Silva', total: 'R$ 450,00', status: 'Entregue', date: '27/12/2025' },
    { id: 2, customer: 'Maria Santos', total: 'R$ 1.200,00', status: 'Processando', date: '27/12/2025' },
    { id: 3, customer: 'Pedro Costa', total: 'R$ 680,00', status: 'Enviado', date: '26/12/2025' },
    { id: 4, customer: 'Ana Lima', total: 'R$ 890,00', status: 'Pendente', date: '26/12/2025' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'Enviado': return 'bg-blue-100 text-blue-800';
      case 'Processando': return 'bg-yellow-100 text-yellow-800';
      case 'Pendente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Receita Total"
            value={stats.revenue}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Pedidos"
            value={stats.orders}
            icon={ShoppingCart}
            trend={{ value: 8.2, isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Clientes"
            value={stats.customers}
            icon={Users}
            trend={{ value: 5.7, isPositive: true }}
            color="purple"
          />
          <StatsCard
            title="Produtos"
            value={stats.products}
            icon={Package}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pedidos Recentes</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Cliente</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{order.customer}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.total}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">Adicionar Produto</span>
                  <Package size={18} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">Gerenciar Usuários</span>
                  <Users size={18} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">Ver Relatórios</span>
                  <TrendingUp size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-900 mb-1">Atenção</h3>
                  <p className="text-sm text-yellow-800">
                    5 produtos com estoque baixo precisam de reposição.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
