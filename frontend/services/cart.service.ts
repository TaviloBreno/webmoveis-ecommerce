import api from "@/lib/api";

export const cartService = {
  async getCart() {
    const response = await api.get("/cart");
    return response.data;
  },

  async getCartCount() {
    const response = await api.get("/cart/count");
    return response.data;
  },

  async addToCart(productId: number, quantity: number) {
    const response = await api.post("/cart/items", {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  async updateCartItem(itemId: number, quantity: number) {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(itemId: number) {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete("/cart");
    return response.data;
  },
};
