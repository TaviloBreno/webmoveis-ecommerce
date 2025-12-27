"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Ticket,
  Package,
  AlertCircle
} from 'lucide-react';

export default function FuncionarioDashboard() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'employee' && user?.role !== 'admin') {
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

  const stats = {
    pendingOrders: 23,
    processingOrders: 15,
    completedToday: 42,
    openTickets: 8,
  };

  const pendingOrders = [
    { id: 1, customer: 'João Silva', total: 'R$ 450,00', time: '2h atrás', priority: 'alta' },
    { id: 2, customer: 'Maria Santos', total: 'R$ 1.200,00', time: '4h atrás', priority: 'normal' },
    { id: 3, customer: 'Pedro Costa', total: 'R$ 680,00', time: '5h atrás', priority: 'normal' },
    { id: 4, customer: 'Ana Lima', total: 'R$ 890,00', time: '1 dia atrás', priority: 'baixa' },
  ];

  const supportTickets = [
    { id: 1, customer: 'Carlos Souza', subject: 'Problema com entrega', status: 'Aberto', priority: 'alta' },
    { id: 2, customer: 'Fernanda Alves', subject: 'Dúvida sobre produto', status: 'Em andamento', priority: 'normal' },
    { id: 3, customer: 'Ricardo Mendes', subject: 'Troca de produto', status: 'Aberto', priority: 'alta' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Funcionário</h1>
          <p className="text-gray-600 mt-2">Gerencie pedidos e atendimentos</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pedidos Pendentes"
            value={stats.pendingOrders}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Em Processamento"
            value={stats.processingOrders}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="Concluídos Hoje"
            value={stats.completedToday}
            icon={CheckCircle}
            trend={{ value: 15, isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Tickets Abertos"
            value={stats.openTickets}
            icon={Ticket}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedidos Pendentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pedidos Pendentes</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </button>
            </div>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{order.total}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                      Processar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets de Suporte */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tickets de Suporte</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todos
              </button>
            </div>
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{ticket.customer}</p>
                      <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500">{ticket.status}</span>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                      Atender
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">Atenção</h3>
              <p className="text-sm text-yellow-800">
                Existem 3 pedidos com mais de 24h aguardando processamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
