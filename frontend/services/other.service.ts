import api from "@/lib/api";

export const categoryService = {
  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  },
};

export const userService = {
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put("/users/profile", data);
    return response.data;
  },

  async changePassword(data: { old_password: string; new_password: string }) {
    const response = await api.put("/users/password", data);
    return response.data;
  },
};

export const addressService = {
  async getAddresses() {
    const response = await api.get("/addresses");
    return response.data;
  },

  async createAddress(data: any) {
    const response = await api.post("/addresses", data);
    return response.data;
  },

  async updateAddress(id: number, data: any) {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  async deleteAddress(id: number) {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },
};

export const wishlistService = {
  async getWishlist() {
    const response = await api.get("/wishlist");
    return response.data;
  },

  async addToWishlist(productId: number) {
    const response = await api.post("/wishlist", { product_id: productId });
    return response.data;
  },

  async removeFromWishlist(productId: number) {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },
};
