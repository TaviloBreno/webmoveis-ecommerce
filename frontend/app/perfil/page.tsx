"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/lib/store/auth-store";
import { userService } from "@/services/other.service";
import { User, Lock, Award, MapPin } from "lucide-react";

export default function PerfilPage() {
  const { user, setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "loyalty">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await userService.updateProfile(profileData);
      setAuth(response, localStorage.getItem("token") || "");
      setMessage("Perfil atualizado com sucesso!");
    } catch (error) {
      setMessage("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage("As senhas não coincidem");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await userService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setMessage("Senha alterada com sucesso!");
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  const loyaltyTiers: Record<string, { name: string; color: string; benefits: string[] }> = {
    bronze: {
      name: "Bronze",
      color: "bg-orange-600",
      benefits: ["1x pontos em compras", "Frete grátis acima de R$ 200"],
    },
    silver: {
      name: "Prata",
      color: "bg-gray-400",
      benefits: ["1.2x pontos em compras", "Frete grátis acima de R$ 150", "5% desconto"],
    },
    gold: {
      name: "Ouro",
      color: "bg-yellow-500",
      benefits: ["1.5x pontos em compras", "Frete grátis acima de R$ 100", "10% desconto"],
    },
    platinum: {
      name: "Platina",
      color: "bg-purple-600",
      benefits: ["2x pontos em compras", "Frete grátis sempre", "15% desconto", "Acesso antecipado"],
    },
  };

  const currentTier = loyaltyTiers[user?.loyalty_tier || "bronze"];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.includes("sucesso")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${
                  activeTab === "profile"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <User size={20} />
                <span>Dados Pessoais</span>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${
                  activeTab === "password"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Lock size={20} />
                <span>Alterar Senha</span>
              </button>
              <button
                onClick={() => setActiveTab("loyalty")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${
                  activeTab === "loyalty"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <Award size={20} />
                <span>Programa de Fidelidade</span>
              </button>
              <Link
                href="/perfil/enderecos"
                className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 hover:bg-gray-100"
              >
                <MapPin size={20} />
                <span>Meus Endereços</span>
              </Link>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Dados Pessoais</h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <Input
                        label="Nome Completo"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="E-mail"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="Telefone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                      />
                      <Input
                        label="CPF"
                        value={profileData.cpf}
                        onChange={(e) =>
                          setProfileData({ ...profileData, cpf: e.target.value })
                        }
                      />
                      <Button type="submit" isLoading={loading}>
                        Salvar Alterações
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              )}

              {activeTab === "password" && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Alterar Senha</h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <Input
                        label="Senha Atual"
                        type="password"
                        value={passwordData.old_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            old_password: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        label="Nova Senha"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new_password: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                      <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm_password: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />
                      <Button type="submit" isLoading={loading}>
                        Alterar Senha
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              )}

              {activeTab === "loyalty" && (
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">Programa de Fidelidade</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {user?.loyalty_points || 0} pontos
                          </h3>
                          <p className="text-gray-600">Seu saldo atual</p>
                        </div>
                        <div
                          className={`px-6 py-3 rounded-lg text-white font-bold ${currentTier.color}`}
                        >
                          {currentTier.name}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold mb-2">Seus Benefícios:</h4>
                        <ul className="space-y-1">
                          {currentTier.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="text-blue-600">✓</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Como Ganhar Pontos:</h4>
                        <p className="text-gray-600">
                          • A cada R$ 1,00 em compras, você ganha 1 ponto (multiplicado pelo
                          seu tier)
                        </p>
                        <p className="text-gray-600">
                          • 1 ponto = R$ 0,01 de desconto em compras futuras
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
