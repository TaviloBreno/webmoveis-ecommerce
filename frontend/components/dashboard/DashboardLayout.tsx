"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Heart,
  MapPin,
  Trophy,
  Ticket,
  FileText
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  // Definir links baseado no tipo de usuário
  const getNavLinks = () => {
    if (user?.role === 'admin') {
      return [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/produtos', label: 'Produtos', icon: Package },
        { href: '/admin/usuarios', label: 'Usuários', icon: Users },
        { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
        { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
      ];
    } else if (user?.role === 'employee') {
      return [
        { href: '/funcionario', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/funcionario/pedidos', label: 'Pedidos', icon: ShoppingCart },
        { href: '/funcionario/suporte', label: 'Suporte', icon: Ticket },
      ];
    } else {
      return [
        { href: '/perfil', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/pedidos', label: 'Meus Pedidos', icon: ShoppingCart },
        { href: '/wishlist', label: 'Favoritos', icon: Heart },
        { href: '/perfil/enderecos', label: 'Endereços', icon: MapPin },
        { href: '/perfil/fidelidade', label: 'Fidelidade', icon: Trophy },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">WM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WebMóveis</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
