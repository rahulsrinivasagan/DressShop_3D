import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type AddItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

type CartState = {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string, size?: string) => void;
  setQuantity: (id: string, quantity: number, size?: string) => void;
  increment: (id: string, size?: string) => void;
  decrement: (id: string, size?: string) => void;
  clear: () => void;
};

const keyFor = (id: string, size?: string) => `${id}::${size ?? ""}`;

const storage =
  typeof window === "undefined" ? undefined : createJSONStorage(() => window.localStorage);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const qtyToAdd = item.quantity ?? 1;
        const itemKey = keyFor(item.id, item.size);
        const existing = get().items.find((i) => keyFor(i.id, i.size) === itemKey);

        if (existing) {
          set({
            items: get().items.map((i) =>
              keyFor(i.id, i.size) === itemKey ? { ...i, quantity: i.quantity + qtyToAdd } : i,
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              size: item.size,
              quantity: qtyToAdd,
            },
          ],
        });
      },
      removeItem: (id, size) => {
        const itemKey = keyFor(id, size);
        set({ items: get().items.filter((i) => keyFor(i.id, i.size) !== itemKey) });
      },
      setQuantity: (id, quantity, size) => {
        const itemKey = keyFor(id, size);
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => keyFor(i.id, i.size) !== itemKey) });
          return;
        }
        set({
          items: get().items.map((i) =>
            keyFor(i.id, i.size) === itemKey ? { ...i, quantity } : i,
          ),
        });
      },
      increment: (id, size) => {
        const itemKey = keyFor(id, size);
        set({
          items: get().items.map((i) =>
            keyFor(i.id, i.size) === itemKey ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        });
      },
      decrement: (id, size) => {
        const itemKey = keyFor(id, size);
        const existing = get().items.find((i) => keyFor(i.id, i.size) === itemKey);
        if (!existing) return;
        const nextQty = existing.quantity - 1;
        if (nextQty <= 0) {
          set({ items: get().items.filter((i) => keyFor(i.id, i.size) !== itemKey) });
          return;
        }
        set({
          items: get().items.map((i) =>
            keyFor(i.id, i.size) === itemKey ? { ...i, quantity: nextQty } : i,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart",
      storage,
      version: 1,
    },
  ),
);

export const selectCartCount = (s: Pick<CartState, "items">) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectCartSubtotal = (s: Pick<CartState, "items">) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

