import api from "@/lib/api";

export const orderService = {
  async createOrder(data: {
    address_id: number;
    shipping_method: string;
    payment_method: string;
    coupon_code?: string;
  }) {
    const response = await api.post("/orders", data);
    return response.data;
  },

  async getOrders() {
    const response = await api.get("/orders");
    return response.data;
  },

  async getOrderById(id: number) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};
