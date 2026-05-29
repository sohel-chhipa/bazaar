import { useCallback } from "react";

import { useUiStore } from "@/shared/store/ui.store";
import type { ApiError } from "@/shared/types/api.types";

export const useApiError = () => {
  const showErrorModal = useUiStore((state) => state.showErrorModal);

  const onApiError = useCallback(
    (error: unknown, fallback?: Partial<ApiError>) => {
      if (typeof error === "object" && error && "message" in error) {
        const typed = error as Partial<ApiError>;

        showErrorModal({
          title: typed.title ?? fallback?.title ?? "Unexpected error",
          message: typed.message ?? fallback?.message ?? "Something went wrong.",
          code: typed.code ?? fallback?.code,
        });
        return;
      }

      showErrorModal({
        title: fallback?.title ?? "Unexpected error",
        message: fallback?.message ?? "Something went wrong.",
        code: fallback?.code,
      });
    },
    [showErrorModal],
  );

  return {
    onApiError,
  };
};
