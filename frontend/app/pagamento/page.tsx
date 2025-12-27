"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  CreditCard,
  Copy,
  Download
} from "lucide-react";
import Image from "next/image";

export default function PagamentoPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { clearCart } = useCartStore();
  
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [boletoUrl, setBoletoUrl] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    // Recupera dados do pedido
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (!pendingOrder) {
      router.push('/checkout');
      return;
    }

    const orderData = JSON.parse(pendingOrder);
    setPaymentMethod(orderData.paymentMethod);
    
    // Simula processamento do pagamento
    processPayment(orderData);
  }, [token, router]);

  const processPayment = async (orderData: any) => {
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Gera número do pedido
      const orderNum = `WM${Date.now().toString().slice(-8)}`;
      setOrderNumber(orderNum);
      
      // Se for PIX, gera código
      if (orderData.paymentMethod === 'pix') {
        setPixCode('00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(7));
      }
      
      // Se for boleto, gera URL
      if (orderData.paymentMethod === 'boleto') {
        setBoletoUrl('/boleto/' + orderNum + '.pdf');
      }
      
      // Limpa carrinho
      clearCart();
      localStorage.removeItem('pendingOrder');
      
      setStatus('success');
      
      // Redireciona para pedidos após 5 segundos se for cartão
      if (orderData.paymentMethod === 'credit' || orderData.paymentMethod === 'debit') {
        setTimeout(() => {
          router.push('/pedidos');
        }, 5000);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setStatus('error');
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processando Pagamento</h2>
          <p className="text-gray-600">Aguarde enquanto confirmamos seu pagamento...</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-red-600" size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Falhou</h2>
          <p className="text-gray-600 mb-6">
            Não foi possível processar seu pagamento. Por favor, tente novamente.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success - PIX
  if (paymentMethod === 'pix') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Criado!</h1>
              <p className="text-gray-600">Pedido #{orderNumber}</p>
            </div>

            {/* PIX Instructions */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3 mb-4">
                <Clock className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Aguardando Pagamento PIX</h3>
                  <p className="text-sm text-gray-600">
                    Use o código abaixo para realizar o pagamento. Você tem 30 minutos para concluir.
                  </p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white rounded-lg p-6 mb-4">
                <div className="w-64 h-64 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <Image
                    src="/qr-code-placeholder.svg"
                    alt="QR Code PIX"
                    width={256}
                    height={256}
                    onError={(e) => {
                      // Fallback se a imagem não existir
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-400 text-center"><svg class="mx-auto mb-2" width="64" height="64" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg><p class="text-sm">QR Code PIX</p></div>';
                    }}
                  />
                </div>
              </div>

              {/* PIX Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código PIX Copia e Cola
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={pixCode}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={copyPixCode}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/pedidos')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Ir para Meus Pedidos
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success - Boleto
  if (paymentMethod === 'boleto') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido Criado!</h1>
              <p className="text-gray-600">Pedido #{orderNumber}</p>
            </div>

            {/* Boleto Instructions */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-3 mb-4">
                <Clock className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Boleto Bancário Gerado</h3>
                  <p className="text-sm text-gray-600">
                    Faça o download do boleto e realize o pagamento em até 3 dias úteis.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.open(boletoUrl, '_blank')}
                className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold flex items-center justify-center"
              >
                <Download size={20} className="mr-2" />
                Download Boleto
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/pedidos')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Ir para Meus Pedidos
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success - Credit/Debit Card
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="text-green-600" size={56} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h1>
          <p className="text-xl text-gray-600 mb-6">Seu pedido foi confirmado com sucesso</p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Número do Pedido</span>
              <span className="font-bold text-gray-900">#{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Método de Pagamento</span>
              <div className="flex items-center space-x-2">
                <CreditCard size={20} className="text-gray-600" />
                <span className="font-medium text-gray-900">
                  Cartão de {paymentMethod === 'credit' ? 'Crédito' : 'Débito'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Confirmado
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-2">Próximos Passos</h3>
            <p className="text-sm text-gray-600">
              Você receberá um e-mail com todos os detalhes do seu pedido. 
              Acompanhe o status da entrega na área "Meus Pedidos".
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/pedidos')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Ver Meus Pedidos
            </button>
            <button
              onClick={() => router.push('/produtos')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Continuar Comprando
            </button>
          </div>

          {/* Redirect Message */}
          <p className="text-sm text-gray-500 mt-6">
            Redirecionando para Meus Pedidos em 5 segundos...
          </p>
        </div>
      </div>
    </div>
  );
}
