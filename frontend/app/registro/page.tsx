"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { authService } from "@/services/auth.service";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User, Mail, Lock, Phone, CreditCard, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      setAuth(response.user, response.access_token);
      router.push("/produtos");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erro ao criar conta. Verifique os dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
          <p className="text-gray-600 mt-2">
            Cadastre-se e comece a comprar
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-9 text-gray-400" size={20} />
            <Input
              label="Nome Completo"
              type="text"
              placeholder="João Silva"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="pl-10"
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <div className="relative">
            <CreditCard className="absolute left-3 top-9 text-gray-400" size={20} />
            <Input
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: e.target.value })
              }
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-9 text-gray-400" size={20} />
            <Input
              label="Telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="pl-10"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-700">
                <strong>Bônus:</strong> Ganhe 10% de desconto na primeira compra!
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Criar Conta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
