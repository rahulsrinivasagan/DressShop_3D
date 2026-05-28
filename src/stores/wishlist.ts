import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type WishlistState = {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "quantity"> & { quantity?: number }) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, "quantity"> & { quantity?: number }) => void;
  isWishlisted: (id: string) => boolean;
  clear: () => void;
};

const storage =
  typeof window === "undefined" ? undefined : createJSONStorage(() => window.localStorage);

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (item) => {
        if (get().items.some((i) => i.id === item.id)) return;
        set({
          items: [
            ...get().items,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              size: item.size,
              quantity: item.quantity ?? 1,
            },
          ],
        });
      },
      removeFromWishlist: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      toggleWishlist: (item) => {
        if (get().items.some((i) => i.id === item.id)) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
          return;
        }
        get().addToWishlist(item);
      },
      isWishlisted: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: "wishlist", storage, version: 1 },
  ),
);

