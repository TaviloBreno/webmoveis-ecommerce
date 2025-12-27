import Link from "next/link";
import { ShoppingBag, TrendingUp, Shield, Truck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Bem-vindo à WebMoveis
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Encontre os melhores produtos com os melhores preços. 
              Compre com segurança e receba em casa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/produtos">
                <Button size="lg">
                  <ShoppingBag className="mr-2" size={20} />
                  Ver Produtos
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Frete Rápido</h3>
              <p className="text-gray-600">
                Entrega rápida e segura para todo o Brasil
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Compra Segura</h3>
              <p className="text-gray-600">
                Seus dados protegidos com criptografia de ponta
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Melhor Preço</h3>
              <p className="text-gray-600">
                Preços competitivos e promoções exclusivas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Eletrônicos", "Moda", "Casa", "Esportes"].map((category) => (
              <Link
                key={category}
                href={`/produtos?categoria=${category.toLowerCase()}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-lg">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Cadastre-se agora e ganhe 10% de desconto na primeira compra
          </p>
          <Link href="/registro">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
