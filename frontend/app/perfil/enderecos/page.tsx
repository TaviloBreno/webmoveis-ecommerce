"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { addressService, Address, CreateAddressDto } from "@/services/address.service";
import { MapPin, Plus, Edit, Trash2, Loader2, Check, X, Star } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function EnderecosContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateAddressDto>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  });

  const [zipCodeLoading, setZipCodeLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAddresses();
    
    // Se tem ID para editar na URL, abre o formulário
    if (editId) {
      const id = parseInt(editId);
      setEditingId(id);
      setShowForm(true);
    }
  }, [editId]);

  useEffect(() => {
    if (editingId) {
      const address = addresses.find((a) => a.id === editingId);
      if (address) {
        setFormData({
          street: address.street,
          number: address.number,
          complement: address.complement || "",
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          isDefault: address.isDefault,
        });
      }
    }
  }, [editingId, addresses]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleZipCodeChange = async (zipCode: string) => {
    const cleanZip = zipCode.replace(/\D/g, "");
    setFormData({ ...formData, zipCode: cleanZip });

    if (cleanZip.length === 8) {
      setZipCodeLoading(true);
      setError("");

      try {
        const data = await addressService.searchZipCode(cleanZip);
        
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      } catch (error) {
        setError("CEP não encontrado");
      } finally {
        setZipCodeLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        await addressService.updateAddress(editingId, formData);
      } else {
        await addressService.createAddress(formData);
      }

      await loadAddresses();
      handleCancel();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      setError("Erro ao salvar endereço. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este endereço?")) return;

    setDeletingId(id);
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      alert("Erro ao deletar endereço");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      await loadAddresses();
    } catch (error) {
      console.error("Erro ao definir endereço padrão:", error);
      alert("Erro ao definir endereço padrão");
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    });
    setError("");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <MapPin className="mx-auto text-white mb-4" size={48} />
              <h1 className="text-4xl font-bold text-white mb-2">
                Meus Endereços
              </h1>
              <p className="text-white/90 text-lg">
                Gerencie seus endereços de entrega
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Add Button */}
            {!showForm && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-8"
              >
                <Button onClick={() => setShowForm(true)} size="lg">
                  <Plus size={20} className="mr-2" />
                  Adicionar Novo Endereço
                </Button>
              </motion.div>
            )}

            {/* Form */}
            {showForm && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-8"
              >
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900">
                      {editingId ? "Editar Endereço" : "Novo Endereço"}
                    </h2>
                    <Button variant="ghost" onClick={handleCancel}>
                      <X size={20} />
                    </Button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* CEP */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        CEP *
                      </label>
                      <div className="relative">
                        <Input
                          value={formData.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2")}
                          onChange={(e) => handleZipCodeChange(e.target.value)}
                          placeholder="00000-000"
                          maxLength={9}
                          required
                        />
                        {zipCodeLoading && (
                          <Loader2
                            className="absolute right-3 top-3 animate-spin text-primary-600"
                            size={20}
                          />
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Digite o CEP para preenchimento automático
                      </p>
                    </div>

                    {/* Rua */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Rua/Avenida *
                      </label>
                      <Input
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        placeholder="Nome da rua"
                        required
                      />
                    </div>

                    {/* Número e Complemento */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Número *
                        </label>
                        <Input
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          placeholder="123"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Complemento
                        </label>
                        <Input
                          value={formData.complement}
                          onChange={(e) =>
                            setFormData({ ...formData, complement: e.target.value })
                          }
                          placeholder="Apto, bloco, etc"
                        />
                      </div>
                    </div>

                    {/* Bairro */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Bairro *
                      </label>
                      <Input
                        value={formData.neighborhood}
                        onChange={(e) =>
                          setFormData({ ...formData, neighborhood: e.target.value })
                        }
                        placeholder="Nome do bairro"
                        required
                      />
                    </div>

                    {/* Cidade e Estado */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Cidade *
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Nome da cidade"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Estado *
                        </label>
                        <Input
                          value={formData.state}
                          onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value.toUpperCase() })
                          }
                          placeholder="SP"
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>

                    {/* Padrão */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) =>
                          setFormData({ ...formData, isDefault: e.target.checked })
                        }
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="isDefault" className="text-sm text-neutral-700">
                        Definir como endereço padrão
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting} className="flex-1">
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Check size={20} className="mr-2" />
                            Salvar Endereço
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="text-neutral-400" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Nenhum endereço cadastrado
                </h2>
                <p className="text-neutral-600 mb-8">
                  Adicione um endereço para facilitar suas compras
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-4"
              >
                {addresses.map((address) => (
                  <Card key={address.id} className="relative">
                    {address.isDefault && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                          <Star size={12} className="mr-1 fill-primary-700" />
                          Padrão
                        </span>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Address Info */}
                      <div className="md:col-span-2">
                        <p className="font-semibold text-neutral-900 text-lg mb-2">
                          {address.street}, {address.number}
                        </p>
                        {address.complement && (
                          <p className="text-neutral-600 mb-1">{address.complement}</p>
                        )}
                        <p className="text-neutral-600 mb-1">
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p className="text-neutral-600">
                          CEP: {address.zipCode.replace(/(\d{5})(\d{3})/, "$1-$2")}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col md:justify-center gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="flex-1"
                          >
                            <Star size={16} className="mr-2" />
                            Definir Padrão
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(address.id)}
                          className="flex-1"
                        >
                          <Edit size={16} className="mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          disabled={deletingId === address.id}
                          className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                        >
                          {deletingId === address.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <>
                              <Trash2 size={16} className="mr-2" />
                              Excluir
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export default function EnderecosPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
      </Layout>
    }>
      <EnderecosContent />
    </Suspense>
  );
}
