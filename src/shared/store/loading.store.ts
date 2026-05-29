import { create } from "zustand";

interface LoadingState {
  loading: Record<string, boolean>;
  setLoading: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: {},
  setLoading: (updater) =>
    set((state) => ({
      loading: updater(state.loading),
    })),
}));
