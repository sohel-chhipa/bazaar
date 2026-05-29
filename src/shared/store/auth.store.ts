import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthSession, User } from "@/shared/types/ecommerce.types";
import { storageService } from "@/shared/lib/storage.service";

export type ProtectedIntent =
  | { type: "checkout" }
  | { type: "buy-now"; productId: number; quantity: number }
  | { type: "route"; path: string }
  | { type: "none" };

interface AuthStoreState {
  isAuthenticated: boolean;
  user: User | null;
  session: AuthSession | null;
  protectedIntent: ProtectedIntent;
  setSession: (user: User, session: AuthSession) => void;
  setProtectedIntent: (intent: ProtectedIntent) => void;
  clearProtectedIntent: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      session: null,
      protectedIntent: { type: "none" },

      setSession(user, session) {
        set({
          user,
          session,
          isAuthenticated: true,
        });
      },

      setProtectedIntent(protectedIntent) {
        set({ protectedIntent });
      },

      clearProtectedIntent() {
        set({ protectedIntent: { type: "none" } });
      },

      logout() {
        set({
          isAuthenticated: false,
          user: null,
          session: null,
          protectedIntent: { type: "none" },
        });
      },
    }),
    {
      name: "bazaar-auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        session: state.session,
      }),
      storage: createJSONStorage(() => storageService),
    },
  ),
);
