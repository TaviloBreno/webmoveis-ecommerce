"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/auth-store";
import { authService } from "@/services/auth.service";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Lock, AlertCircle, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      setAuth(response.user, response.access_token);
      router.push("/produtos");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=2000"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-secondary-900/85 to-primary-900/90"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">WM</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Entrar</h1>
          <p className="text-gray-600 mt-2">
            Acesse sua conta na WebMoveis
          </p>
        </div>

        {/* Demo Users Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <User size={16} className="mr-2" />
            Usuários de Teste:
          </p>
          <div className="space-y-1 text-xs text-blue-800">
            <p><strong>Admin:</strong> admin@webmoveis.com | Senha: admin123</p>
            <p><strong>Funcionário:</strong> func@webmoveis.com | Senha: func123</p>
            <p><strong>Cliente:</strong> cliente@webmoveis.com | Senha: cliente123</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-9 text-gray-400" size={20} />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-9 text-gray-400" size={20} />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="pl-10"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-600">Lembrar de mim</span>
            </label>
            <Link
              href="/recuperar-senha"
              className="text-blue-600 hover:text-blue-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link href="/registro" className="text-blue-600 hover:text-blue-700 font-medium">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
