import { create } from "zustand";

interface CartItem {
  id: number;
  product_id: number;
  product: {
    name: string;
    price: number;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  setCart: (items: CartItem[], total: number) => void;
  updateItemCount: (count: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  itemCount: 0,
  setCart: (items, total) =>
    set({
      items,
      total,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    }),
  updateItemCount: (count) => set({ itemCount: count }),
  clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
}));
