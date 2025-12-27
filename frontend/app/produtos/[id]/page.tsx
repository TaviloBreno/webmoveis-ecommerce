"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { formatCurrency } from "@/lib/utils";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  CheckCircle,
  Minus,
  Plus,
  Package
} from "lucide-react";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { updateItemCount } = useCartStore();
  const { isInWishlistStore, addToWishlistStore, removeFromWishlistStore } = useWishlistStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(Number(params.id));
      setProduct(data);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addToCart(product.id, quantity);
      const count = await cartService.getCartCount();
      updateItemCount(count.count || 0);
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar ao carrinho");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setTogglingWishlist(true);
    try {
      const isInWishlist = isInWishlistStore(product.id);
      
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(product.id);
        removeFromWishlistStore(product.id);
      } else {
        await wishlistService.addToWishlist(product.id);
        addToWishlistStore(product.id);
      }
    } catch (error) {
      console.error("Erro ao gerenciar wishlist:", error);
      alert("Erro ao atualizar lista de desejos");
    } finally {
      setTogglingWishlist(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-neutral-600">Carregando produto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Produto não encontrado</h1>
          <Button onClick={() => router.push("/produtos")}>Ver todos os produtos</Button>
        </div>
      </Layout>
    );
  }

  const images = product.images?.length > 0 
    ? product.images.map((img: any) => img.url)
    : [
        `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800`,
        `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,
        `https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800`
      ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-neutral-600">
            <li><a href="/" className="hover:text-primary-600">Home</a></li>
            <li>/</li>
            <li><a href="/produtos" className="hover:text-primary-600">Produtos</a></li>
            <li>/</li>
            <li className="text-neutral-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative h-[500px] bg-neutral-100 rounded-2xl overflow-hidden mb-4 group">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? "border-primary-600 scale-105" 
                      : "border-neutral-200 hover:border-primary-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                  />
                ))}
              </div>
              <span className="text-neutral-600">(4.0)</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-600">128 avaliações</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-bold text-primary-600">
                  {formatCurrency(product.price)}
                </span>
                {product.discount && (
                  <span className="text-2xl text-neutral-400 line-through">
                    {formatCurrency(product.price * 1.2)}
                  </span>
                )}
              </div>
              {product.discount && (
                <span className="inline-block mt-2 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold">
                  Economize {product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Descrição</h3>
              <p className="text-neutral-700 leading-relaxed">
                {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Quantidade</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus size={20} className="text-neutral-700" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg border-x-2 border-neutral-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus size={20} className="text-neutral-700" />
                  </button>
                </div>
                <span className="text-neutral-600">
                  {product.stock > 0 ? `${product.stock} disponíveis` : "Em estoque"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                size="lg"
                className="flex-1 shadow-lg hover:shadow-xl"
              >
                {addingToCart ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adicionando...
                  </span>
                ) : (
                  <>
                    <ShoppingCart size={20} className="mr-2" />
                    Adicionar ao Carrinho
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-red-50 hover:border-red-500"
              >
                <Heart size={20} className="text-red-500" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t border-neutral-200 pt-6">
              <div className="flex items-start space-x-3">
                <Truck className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-neutral-900">Frete Grátis</h4>
                  <p className="text-sm text-neutral-600">Em pedidos acima de R$ 200</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="text-accent-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-neutral-900">Compra Segura</h4>
                  <p className="text-sm text-neutral-600">Proteção total em suas compras</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-secondary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-neutral-900">Garantia Estendida</h4>
                  <p className="text-sm text-neutral-600">12 meses de garantia do fabricante</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="text-primary-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-neutral-900">Entrega Rápida</h4>
                  <p className="text-sm text-neutral-600">Receba em até 7 dias úteis</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="bg-neutral-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Especificações</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-semibold text-neutral-700">Marca</span>
                <span className="text-neutral-900">Premium Brand</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-semibold text-neutral-700">Modelo</span>
                <span className="text-neutral-900">2024 Edition</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-semibold text-neutral-700">Cor</span>
                <span className="text-neutral-900">Preto</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-semibold text-neutral-700">Material</span>
                <span className="text-neutral-900">Premium Quality</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-semibold text-neutral-700">Garantia</span>
                <span className="text-neutral-900">12 meses</span>
              </div>
              <div className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-semibold text-neutral-700">Origem</span>
                <span className="text-neutral-900">Importado</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Produtos Relacionados</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer">
                <div className="relative h-48 bg-neutral-200">
                  <Image
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=400`}
                    alt={`Produto ${i}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Produto Relacionado {i}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">
                      {formatCurrency(Math.random() * 500 + 100)}
                    </span>
                    <Button size="sm">
                      <ShoppingCart size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
