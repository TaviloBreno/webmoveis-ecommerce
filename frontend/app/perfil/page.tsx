"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  ShoppingCart, 
  Heart, 
  MapPin, 
  Trophy,
  Package,
  TrendingUp,
  Star
} from 'lucide-react';

export default function ClienteDashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
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

  const stats = {
    orders: 12,
    wishlist: 8,
    addresses: 2,
    loyaltyPoints: user?.loyalty_points || 0,
  };

  const recentOrders = [
    { id: 1, products: 'Sofá 3 Lugares + Mesa de Centro', total: 'R$ 2.450,00', status: 'Entregue', date: '20/12/2025' },
    { id: 2, products: 'Cadeira Office Premium', total: 'R$ 890,00', status: 'Em trânsito', date: '25/12/2025' },
    { id: 3, products: 'Estante Modular', total: 'R$ 1.200,00', status: 'Processando', date: '26/12/2025' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'Em trânsito': return 'bg-blue-100 text-blue-800';
      case 'Processando': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoyaltyTier = () => {
    const tier = user?.loyalty_tier || 'bronze';
    const colors = {
      bronze: 'from-amber-700 to-amber-900',
      silver: 'from-gray-400 to-gray-600',
      gold: 'from-yellow-400 to-yellow-600',
      platinum: 'from-purple-400 to-purple-600',
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Meus Pedidos"
            value={stats.orders}
            icon={ShoppingCart}
            color="blue"
          />
          <StatsCard
            title="Lista de Desejos"
            value={stats.wishlist}
            icon={Heart}
            color="red"
          />
          <StatsCard
            title="Endereços"
            value={stats.addresses}
            icon={MapPin}
            color="green"
          />
          <StatsCard
            title="Pontos Fidelidade"
            value={stats.loyaltyPoints}
            icon={Trophy}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pedidos Recentes</h2>
              <button 
                onClick={() => router.push('/pedidos')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver todos
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{order.products}</p>
                      <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900">{order.total}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Programa de Fidelidade */}
            <div className={`bg-gradient-to-br ${getLoyaltyTier()} rounded-xl p-6 text-white`}>
              <div className="flex items-center space-x-2 mb-4">
                <Trophy size={24} />
                <h3 className="text-lg font-bold">Programa Fidelidade</h3>
              </div>
              <p className="text-2xl font-bold mb-2">{stats.loyaltyPoints} pontos</p>
              <p className="text-sm opacity-90 capitalize mb-4">Nível: {user?.loyalty_tier}</p>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-white rounded-full h-2" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs opacity-75">350 pontos até o próximo nível</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/produtos')}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Continuar Comprando</span>
                  <Package size={18} className="text-gray-400" />
                </button>
                <button 
                  onClick={() => router.push('/wishlist')}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Meus Favoritos</span>
                  <Heart size={18} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">Avaliar Produtos</span>
                  <Star size={18} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Benefícios */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <TrendingUp size={24} className="mb-3" />
              <h3 className="text-lg font-bold mb-2">Benefícios Exclusivos</h3>
              <p className="text-sm opacity-90">
                Aproveite frete grátis em compras acima de R$ 500,00 e ganhe pontos em dobro!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
