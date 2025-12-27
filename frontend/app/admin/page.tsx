"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Settings,
  BarChart,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      icon: DollarSign,
      title: "Receita Total",
      value: "R$ 125.450,00",
      change: "+12.5%",
      positive: true
    },
    {
      icon: ShoppingCart,
      title: "Pedidos",
      value: "1.234",
      change: "+8.2%",
      positive: true
    },
    {
      icon: Users,
      title: "Clientes",
      value: "5.678",
      change: "+5.1%",
      positive: true
    },
    {
      icon: Package,
      title: "Produtos",
      value: "890",
      change: "-2.3%",
      positive: false
    }
  ];

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-neutral-600">
              Visão geral do seu e-commerce
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <stat.icon className="text-primary-600" size={24} />
                      </div>
                      <span className={`text-sm font-semibold ${
                        stat.positive ? "text-accent-600" : "text-red-600"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-neutral-600 text-sm mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Ações Rápidas
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="w-full justify-start" size="lg">
                  <Package className="mr-3" size={20} />
                  Gerenciar Produtos
                </Button>
                <Button className="w-full justify-start" size="lg" variant="secondary">
                  <Users className="mr-3" size={20} />
                  Gerenciar Usuários
                </Button>
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <FileText className="mr-3" size={20} />
                  Relatórios
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Orders */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">
                    Pedidos Recentes
                  </h2>
                  <Button variant="ghost" size="sm">Ver Todos</Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-neutral-200 last:border-0">
                      <div>
                        <p className="font-semibold text-neutral-900">#ORD{1000 + i}</p>
                        <p className="text-sm text-neutral-600">Cliente {i}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">R$ {(Math.random() * 500 + 100).toFixed(2)}</p>
                        <span className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded-full">
                          Concluído
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900">
                    Produtos em Destaque
                  </h2>
                  <Button variant="ghost" size="sm">Ver Todos</Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-neutral-200 last:border-0">
                      <div>
                        <p className="font-semibold text-neutral-900">Produto {i}</p>
                        <p className="text-sm text-neutral-600">{Math.floor(Math.random() * 50)} vendas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">R$ {(Math.random() * 200 + 50).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </RoleProtectedRoute>
  );
}
