"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cartService } from "@/services/cart.service";
import { addressService, Address } from "@/services/address.service";
import { shippingService, ShippingOption } from "@/services/shipping.service";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  MapPin,
  Truck,
  CreditCard,
  Check,
  Plus,
  Edit,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Endereço, 2: Frete, 3: Pagamento, 4: Confirmação
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Endereços
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Frete
  const [zipCode, setZipCode] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix" | "boleto">("credit_card");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cartData, addressesData] = await Promise.all([
        cartService.getCart(),
        addressService.getAddresses(),
      ]);

      setCartItems(cartData.items || []);
      setAddresses(addressesData);

      // Calcula total
      const total = cartData.items.reduce(
        (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
        0
      );
      setCartTotal(total);

      // Seleciona endereço padrão automaticamente
      const defaultAddress = addressesData.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        setZipCode(defaultAddress.zipCode);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar informações do checkout");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateShipping = async () => {
    if (!zipCode || zipCode.length < 8) {
      setError("CEP inválido");
      return;
    }

    setCalculatingShipping(true);
    setError("");

    try {
      const result = await shippingService.calculateShipping({
        zipCode,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      setShippingOptions(result.options);
      if (result.options.length > 0) {
        setSelectedShipping(result.options[0]); // Seleciona primeira opção por padrão
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      setError("Erro ao calcular frete. Tente novamente.");
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setZipCode(address.zipCode);
    setShippingOptions([]);
    setSelectedShipping(null);
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedAddress) {
      setError("Selecione um endereço de entrega");
      return;
    }
    if (step === 2 && !selectedShipping) {
      setError("Selecione uma opção de frete");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleFinishOrder = async () => {
    setProcessing(true);
    setError("");

    try {
      // Simula processamento do pedido
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Aqui você integraria com a API real de pedidos
      // await orderService.createOrder({
      //   addressId: selectedAddress!.id,
      //   shippingId: selectedShipping!.id,
      //   paymentMethod,
      // });

      setSuccess(true);
      setStep(4);

      // Redireciona após 3 segundos
      setTimeout(() => {
        router.push("/pedidos");
      }, 3000);
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      setError("Erro ao processar pedido. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  const totalWithShipping = cartTotal + (selectedShipping?.price || 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="mx-auto text-neutral-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-neutral-600 mb-8">
            Adicione produtos ao carrinho para fazer o checkout
          </p>
          <Link href="/produtos">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-neutral-50 min-h-screen py-12">
          <div className="container mx-auto px-4">
            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: "Endereço", icon: MapPin },
                  { num: 2, label: "Frete", icon: Truck },
                  { num: 3, label: "Pagamento", icon: CreditCard },
                  { num: 4, label: "Confirmação", icon: Check },
                ].map((item, index) => (
                  <div key={item.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          step >= item.num
                            ? "bg-primary-600 text-white shadow-lg"
                            : "bg-neutral-300 text-neutral-600"
                        }`}
                      >
                        <item.icon size={20} />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step >= item.num ? "text-primary-600" : "text-neutral-500"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`h-1 flex-1 mx-4 transition-all ${
                          step > item.num ? "bg-primary-600" : "bg-neutral-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3"
                  >
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Step 1: Endereço */}
                {step === 1 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">
                          Endereço de Entrega
                        </h2>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddressForm(!showAddressForm)}
                        >
                          <Plus size={16} className="mr-2" />
                          Novo Endereço
                        </Button>
                      </div>

                      {addresses.length === 0 ? (
                        <div className="text-center py-12">
                          <MapPin className="mx-auto text-neutral-400 mb-4" size={48} />
                          <p className="text-neutral-600 mb-4">
                            Você ainda não tem endereços cadastrados
                          </p>
                          <Button onClick={() => router.push("/perfil/enderecos")}>
                            Cadastrar Endereço
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addresses.map((address) => (
                            <div
                              key={address.id}
                              onClick={() => handleSelectAddress(address)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedAddress?.id === address.id
                                  ? "border-primary-600 bg-primary-50"
                                  : "border-neutral-200 hover:border-primary-300"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                                      selectedAddress?.id === address.id
                                        ? "border-primary-600 bg-primary-600"
                                        : "border-neutral-300"
                                    }`}
                                  >
                                    {selectedAddress?.id === address.id && (
                                      <Check size={12} className="text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-neutral-900">
                                      {address.street}, {address.number}
                                    </p>
                                    {address.complement && (
                                      <p className="text-sm text-neutral-600">
                                        {address.complement}
                                      </p>
                                    )}
                                    <p className="text-sm text-neutral-600">
                                      {address.neighborhood} - {address.city}/{address.state}
                                    </p>
                                    <p className="text-sm text-neutral-600">
                                      CEP: {shippingService.formatZipCode(address.zipCode)}
                                    </p>
                                    {address.isDefault && (
                                      <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                                        Padrão
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/perfil/enderecos?edit=${address.id}`);
                                  }}
                                >
                                  <Edit size={16} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedAddress && (
                        <Button onClick={handleNextStep} className="w-full mt-6">
                          Continuar para o Frete
                          <ChevronRight size={20} className="ml-2" />
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Frete */}
                {step === 2 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                        Opções de Entrega
                      </h2>

                      {/* CEP Calculator */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          CEP de Entrega
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            value={shippingService.formatZipCode(zipCode)}
                            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                            placeholder="00000-000"
                            maxLength={9}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleCalculateShipping}
                            disabled={calculatingShipping || !zipCode}
                          >
                            {calculatingShipping ? (
                              <Loader2 className="animate-spin" size={20} />
                            ) : (
                              "Calcular"
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Shipping Options */}
                      {shippingOptions.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h3 className="font-semibold text-neutral-900">
                            Escolha uma opção:
                          </h3>
                          {shippingOptions.map((option) => (
                            <div
                              key={option.id}
                              onClick={() => setSelectedShipping(option)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedShipping?.id === option.id
                                  ? "border-primary-600 bg-primary-50"
                                  : "border-neutral-200 hover:border-primary-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                                      selectedShipping?.id === option.id
                                        ? "border-primary-600 bg-primary-600"
                                        : "border-neutral-300"
                                    }`}
                                  >
                                    {selectedShipping?.id === option.id && (
                                      <Check size={12} className="text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-neutral-900">
                                      {option.name} - {option.carrier}
                                    </p>
                                    <p className="text-sm text-neutral-600">
                                      {option.description}
                                    </p>
                                    <p className="text-sm text-neutral-600 mt-1">
                                      Entrega em até {option.deliveryTime} dias úteis
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                      Previsão: {shippingService.formatDeliveryDate(option.deliveryTime)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-primary-600">
                                    {formatCurrency(option.price)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                          Voltar
                        </Button>
                        {selectedShipping && (
                          <Button onClick={handleNextStep} className="flex-1">
                            Continuar para Pagamento
                            <ChevronRight size={20} className="ml-2" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Pagamento */}
                {step === 3 && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.4 }}
                  >
                    <Card>
                      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                        Forma de Pagamento
                      </h2>

                      <div className="space-y-3 mb-6">
                        {[
                          { id: "credit_card", label: "Cartão de Crédito", icon: CreditCard },
                          { id: "pix", label: "PIX", icon: CreditCard },
                          { id: "boleto", label: "Boleto Bancário", icon: CreditCard },
                        ].map((method) => (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              paymentMethod === method.id
                                ? "border-primary-600 bg-primary-50"
                                : "border-neutral-200 hover:border-primary-300"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  paymentMethod === method.id
                                    ? "border-primary-600 bg-primary-600"
                                    : "border-neutral-300"
                                }`}
                              >
                                {paymentMethod === method.id && (
                                  <Check size={12} className="text-white" />
                                )}
                              </div>
                              <method.icon size={24} className="text-neutral-600" />
                              <span className="font-semibold text-neutral-900">
                                {method.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                          Voltar
                        </Button>
                        <Button
                          onClick={handleFinishOrder}
                          disabled={processing}
                          className="flex-1"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={20} />
                              Processando...
                            </>
                          ) : (
                            <>
                              Finalizar Pedido
                              <Check size={20} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 4: Sucesso */}
                {step === 4 && success && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="text-center py-12">
                      <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="text-accent-600" size={40} />
                      </div>
                      <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                        Pedido Realizado com Sucesso!
                      </h2>
                      <p className="text-neutral-600 mb-8">
                        Você receberá um e-mail com os detalhes do seu pedido.
                      </p>
                      <Link href="/pedidos">
                        <Button>Ver Meus Pedidos</Button>
                      </Link>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Sidebar - Resumo do Pedido */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    Resumo do Pedido
                  </h3>

                  {/* Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex space-x-3">
                        <div className="relative w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={
                              item.product.imageUrl ||
                              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
                            }
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 text-sm truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Qtd: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-primary-600">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-neutral-200 pt-4 space-y-2">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    {selectedShipping && (
                      <div className="flex justify-between text-neutral-600">
                        <span>Frete ({selectedShipping.name})</span>
                        <span>{formatCurrency(selectedShipping.price)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                      <span>Total</span>
                      <span className="text-primary-600">
                        {formatCurrency(totalWithShipping)}
                      </span>
                    </div>
                  </div>

                  {/* Info adicional */}
                  {selectedAddress && (
                    <div className="mt-6 p-3 bg-neutral-100 rounded-lg">
                      <p className="text-xs font-semibold text-neutral-700 mb-1">
                        Entregar em:
                      </p>
                      <p className="text-xs text-neutral-600">
                        {selectedAddress.street}, {selectedAddress.number}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {selectedAddress.city}/{selectedAddress.state} -{" "}
                        {shippingService.formatZipCode(selectedAddress.zipCode)}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
