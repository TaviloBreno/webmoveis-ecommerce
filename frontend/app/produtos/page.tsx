"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Heart, Filter, Grid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProdutosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { updateItemCount } = useCartStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    search: searchParams?.get("search") || "",
    min_price: "",
    max_price: "",
    sort_by: "newest" as any,
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        ...filters,
        min_price: filters.min_price ? parseFloat(filters.min_price) : undefined,
        max_price: filters.max_price ? parseFloat(filters.max_price) : undefined,
        limit: 20,
      });
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      await cartService.addToCart(productId, 1);
      const count = await cartService.getCartCount();
      updateItemCount(count.count || 0);
      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao adicionar ao carrinho");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-semibold">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Preço mínimo"
                value={filters.min_price}
                onChange={(e) =>
                  setFilters({ ...filters, min_price: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Preço máximo"
                value={filters.max_price}
                onChange={(e) =>
                  setFilters({ ...filters, max_price: e.target.value })
                }
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={filters.sort_by}
                onChange={(e) =>
                  setFilters({ ...filters, sort_by: e.target.value as any })
                }
                className="px-4 py-2 border rounded-lg"
              >
                <option value="newest">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {products.map((product) => (
              <Card key={product.id} hover>
                {viewMode === "grid" ? (
                  <div>
                    <Link href={`/produtos/${product.id}`}>
                      <div className="relative h-48 bg-gray-200">
                        {product.images?.[0]?.url && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/produtos/${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCart size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex p-4 space-x-4">
                    <Link href={`/produtos/${product.id}`}>
                      <div className="relative w-32 h-32 bg-gray-200 flex-shrink-0">
                        {product.images?.[0]?.url && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/produtos/${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                        <Button onClick={() => handleAddToCart(product.id)}>
                          Adicionar ao Carrinho
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
