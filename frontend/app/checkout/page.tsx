"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { cartService } from "@/services/cart.service";
import { addressService } from "@/services/address.service";
import { 
  ShoppingBag, 
  MapPin, 
  Truck, 
  CreditCard, 
  Check,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

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

interface Address {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { clearCart } = useCartStore();
  
  const [step, setStep] = useState(1); // 1: Carrinho, 2: Endereço, 3: Pagamento
  const [loading, setLoading] = useState(true);
  
  // Dados do carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  
  // Endereços
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  // Frete
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const shippingCosts = {
    standard: 15.00,
    express: 30.00
  };
  
  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'pix' | 'boleto'>('credit');
  
  // Dados do cartão
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadCheckoutData();
  }, [token, router]);

  const loadCheckoutData = async () => {
    setLoading(true);
    try {
      const [cart, addressList] = await Promise.all([
        cartService.getCart(),
        addressService.getAddresses()
      ]);
      
      setCartItems(cart.items || []);
      setAddresses(addressList);
      
      // Calcula subtotal
      const total = (cart.items || []).reduce(
        (sum: number, item: CartItem) => sum + (item.product.price * item.quantity),
        0
      );
      setSubtotal(total);
      
      // Seleciona endereço padrão
      const defaultAddr = addressList.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar informações do checkout');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && cartItems.length === 0) {
      setError('Seu carrinho está vazio');
      return;
    }
    if (step === 2 && !selectedAddressId) {
      setError('Selecione um endereço de entrega');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleFinishOrder = () => {
    // Validação do pagamento
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        setError('Preencha todos os dados do cartão');
        return;
      }
    }
    
    // Redireciona para página de pagamento
    const orderData = {
      addressId: selectedAddressId,
      shippingMethod,
      paymentMethod,
      cardData: (paymentMethod === 'credit' || paymentMethod === 'debit') ? cardData : null
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    router.push('/pagamento');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
  };

  const shipping = shippingCosts[shippingMethod];
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Pedido</h1>
          <p className="text-gray-600 mt-2">Complete seu pedido em {3 - step + 1} {3 - step + 1 === 1 ? 'passo' : 'passos'}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Carrinho', icon: ShoppingBag },
              { num: 2, label: 'Entrega', icon: MapPin },
              { num: 3, label: 'Pagamento', icon: CreditCard }
            ].map((item, idx) => (
              <div key={item.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ 
                    step >= item.num 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > item.num ? <Check size={24} /> : <item.icon size={24} />}
                  </div>
                  <span className={`text-sm mt-2 ${step >= item.num ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-4 ${step > item.num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Carrinho */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Itens do Pedido</h2>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                    <button
                      onClick={() => router.push('/produtos')}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="text-gray-300" size={32} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.product.price)} cada</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Endereço */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Endereço de Entrega</h2>
                  <button
                    onClick={() => router.push('/perfil/enderecos')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Novo Endereço
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 mb-4">Nenhum endereço cadastrado</p>
                    <button
                      onClick={() => router.push('/perfil/enderecos')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Cadastrar Endereço
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-5 h-5 rounded-full border-2 mt-0.5 mr-3 flex items-center justify-center ${
                            selectedAddressId === address.id
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedAddressId === address.id && <Check className="text-white" size={14} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-gray-900">
                                {address.street}, {address.number}
                              </p>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Padrão
                                </span>
                              )}
                            </div>
                            {address.complement && (
                              <p className="text-sm text-gray-600">{address.complement}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              {address.neighborhood}, {address.city} - {address.state}
                            </p>
                            <p className="text-sm text-gray-600">CEP: {address.zipCode}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shipping Options */}
                {selectedAddressId && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Método de Entrega</h3>
                    <div className="space-y-3">
                      <div
                        onClick={() => setShippingMethod('standard')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          shippingMethod === 'standard'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              shippingMethod === 'standard'
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {shippingMethod === 'standard' && <Check className="text-white" size={14} />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Entrega Padrão</p>
                              <p className="text-sm text-gray-600">5-7 dias úteis</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900">{formatPrice(shippingCosts.standard)}</p>
                        </div>
                      </div>
                      
                      <div
                        onClick={() => setShippingMethod('express')}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          shippingMethod === 'express'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              shippingMethod === 'express'
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {shippingMethod === 'express' && <Check className="text-white" size={14} />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Entrega Expressa</p>
                              <p className="text-sm text-gray-600">2-3 dias úteis</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900">{formatPrice(shippingCosts.express)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pagamento */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Forma de Pagamento</h2>
                
                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { id: 'credit', label: 'Crédito', icon: CreditCard },
                    { id: 'debit', label: 'Débito', icon: CreditCard },
                    { id: 'pix', label: 'PIX', icon: CreditCard },
                    { id: 'boleto', label: 'Boleto', icon: CreditCard }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <method.icon className={`mx-auto mb-2 ${
                        paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'
                      }`} size={32} />
                      <p className={`text-sm font-medium ${
                        paymentMethod === method.id ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {method.label}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Card Form */}
                {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="João Silva"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX Info */}
                {paymentMethod === 'pix' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Após confirmar o pedido, você receberá um QR Code para pagamento via PIX. 
                      O pedido será processado após a confirmação do pagamento.
                    </p>
                  </div>
                )}

                {/* Boleto Info */}
                {paymentMethod === 'boleto' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      O boleto será gerado após a confirmação do pedido e estará disponível para download. 
                      O prazo de pagamento é de 3 dias úteis.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
                  <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                
                {step >= 2 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete ({shippingMethod === 'express' ? 'Expresso' : 'Padrão'})</span>
                    <span className="font-semibold text-gray-900">{formatPrice(shipping)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(step >= 2 ? total : subtotal)}
                </span>
              </div>
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center"
                >
                  Continuar
                  <ChevronRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleFinishOrder}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center"
                >
                  <Check size={20} className="mr-2" />
                  Finalizar Pedido
                </button>
              )}
              
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="w-full mt-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Voltar
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <Check size={16} className="text-green-600" />
                  <span>Compra 100% segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
