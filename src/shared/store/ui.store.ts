import { create } from "zustand";

import type { ApiError } from "@/shared/types/api.types";

interface UiState {
  isAuthModalOpen: boolean;
  authModalReason: string;
  globalError: ApiError | null;
  searchQuery: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  showErrorModal: (error: ApiError) => void;
  clearErrorModal: () => void;
  setSearchQuery: (value: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isAuthModalOpen: false,
  authModalReason: "",
  globalError: null,
  searchQuery: "",

  openAuthModal(reason = "Continue to proceed") {
    set({
      isAuthModalOpen: true,
      authModalReason: reason,
    });
  },

  closeAuthModal() {
    set({
      isAuthModalOpen: false,
      authModalReason: "",
    });
  },

  showErrorModal(globalError) {
    set({ globalError });
  },

  clearErrorModal() {
    set({ globalError: null });
  },

  setSearchQuery(searchQuery) {
    set({ searchQuery });
  },
}));
