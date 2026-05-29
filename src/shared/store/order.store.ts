import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LocalOrder } from "@/shared/types/ecommerce.types";
import { storageService } from "@/shared/lib/storage.service";

interface OrderStoreState {
  localOrders: LocalOrder[];
  lastPlacedOrderId: string | null;
  addLocalOrder: (order: LocalOrder) => void;
  clearLastPlacedOrder: () => void;
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set) => ({
      localOrders: [],
      lastPlacedOrderId: null,

      addLocalOrder(order) {
        set((state) => ({
          localOrders: [order, ...state.localOrders],
          lastPlacedOrderId: order.id,
        }));
      },

      clearLastPlacedOrder() {
        set({ lastPlacedOrderId: null });
      },
    }),
    {
      name: "bazaar-order-store",
      partialize: (state) => ({
        localOrders: state.localOrders,
        lastPlacedOrderId: state.lastPlacedOrderId,
      }),
      storage: createJSONStorage(() => storageService),
    },
  ),
);
