import api from "@/lib/api";

export interface ProductFilters {
  limit?: number;
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: "price_asc" | "price_desc" | "name" | "newest";
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const response = await api.get("/products", { params: filters });
    return response.data;
  },

  async getProductById(id: number) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async searchProducts(query: string) {
    const response = await api.get("/products/search", { params: { q: query } });
    return response.data;
  },
};
