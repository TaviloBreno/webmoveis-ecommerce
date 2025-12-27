import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  wishlistCount: number;
  wishlistItems: Set<number>; // IDs dos produtos na wishlist
  
  // Actions
  setWishlistCount: (count: number) => void;
  addToWishlistStore: (productId: number) => void;
  removeFromWishlistStore: (productId: number) => void;
  isInWishlistStore: (productId: number) => boolean;
  clearWishlistStore: () => void;
  loadWishlistItems: (items: number[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistCount: 0,
      wishlistItems: new Set<number>(),

      setWishlistCount: (count) => {
        set({ wishlistCount: count });
      },

      addToWishlistStore: (productId) => {
        set((state) => {
          const newItems = new Set(state.wishlistItems);
          newItems.add(productId);
          return {
            wishlistItems: newItems,
            wishlistCount: newItems.size,
          };
        });
      },

      removeFromWishlistStore: (productId) => {
        set((state) => {
          const newItems = new Set(state.wishlistItems);
          newItems.delete(productId);
          return {
            wishlistItems: newItems,
            wishlistCount: newItems.size,
          };
        });
      },

      isInWishlistStore: (productId) => {
        return get().wishlistItems.has(productId);
      },

      clearWishlistStore: () => {
        set({
          wishlistItems: new Set<number>(),
          wishlistCount: 0,
        });
      },

      loadWishlistItems: (items) => {
        set({
          wishlistItems: new Set(items),
          wishlistCount: items.length,
        });
      },
    }),
    {
      name: "wishlist-storage",
      // Converter Set para Array para persistência
      partialize: (state) => ({
        wishlistCount: state.wishlistCount,
        wishlistItems: Array.from(state.wishlistItems),
      }),
      // Converter Array de volta para Set ao carregar
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.wishlistItems)) {
          state.wishlistItems = new Set(state.wishlistItems);
        }
      },
    }
  )
);
