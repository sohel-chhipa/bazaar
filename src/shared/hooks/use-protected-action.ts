import { useNavigate } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { useAuthStore, type ProtectedIntent } from "@/shared/store/auth.store";
import { useUiStore } from "@/shared/store/ui.store";

export const useProtectedAction = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setProtectedIntent = useAuthStore((state) => state.setProtectedIntent);
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  const runProtectedAction = (
    intent: ProtectedIntent,
    whenAuthenticated: () => void,
    reason = "Please login to continue",
  ) => {
    if (isAuthenticated) {
      whenAuthenticated();
      return;
    }

    setProtectedIntent(intent);
    openAuthModal(reason);
  };

  const goToCheckoutWithAuth = () => {
    runProtectedAction(
      { type: "checkout" },
      () => {
        navigate(PAGE_URLS.CHECKOUT);
      },
      "Please login to continue with your purchase",
    );
  };

  const goToRouteWithAuth = (path: string, reason = "Login to continue") => {
    runProtectedAction(
      { type: "route", path },
      () => {
        navigate(path);
      },
      reason,
    );
  };

  return {
    runProtectedAction,
    goToCheckoutWithAuth,
    goToRouteWithAuth,
  };
};
