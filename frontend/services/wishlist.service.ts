import api from "@/lib/axios";

export interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    inStock: boolean;
  };
  createdAt: string;
}

class WishlistService {
  /**
   * Busca todos os itens da wishlist
   */
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await api.get("/wishlist");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar wishlist:", error);
      throw error;
    }
  }

  /**
   * Adiciona um produto à wishlist
   */
  async addToWishlist(productId: number): Promise<WishlistItem> {
    try {
      const response = await api.post("/wishlist", { productId });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar à wishlist:", error);
      throw error;
    }
  }

  /**
   * Remove um produto da wishlist
   */
  async removeFromWishlist(productId: number): Promise<void> {
    try {
      await api.delete(`/wishlist/${productId}`);
    } catch (error) {
      console.error("Erro ao remover da wishlist:", error);
      throw error;
    }
  }

  /**
   * Verifica se um produto está na wishlist
   */
  async isInWishlist(productId: number): Promise<boolean> {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);
      return response.data.inWishlist;
    } catch (error) {
      console.error("Erro ao verificar wishlist:", error);
      return false;
    }
  }

  /**
   * Limpa toda a wishlist
   */
  async clearWishlist(): Promise<void> {
    try {
      await api.delete("/wishlist");
    } catch (error) {
      console.error("Erro ao limpar wishlist:", error);
      throw error;
    }
  }

  /**
   * Conta itens na wishlist
   */
  async getWishlistCount(): Promise<number> {
    try {
      const response = await api.get("/wishlist/count");
      return response.data.count || 0;
    } catch (error) {
      console.error("Erro ao contar wishlist:", error);
      return 0;
    }
  }
}

export const wishlistService = new WishlistService();
