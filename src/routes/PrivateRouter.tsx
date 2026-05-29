import type { ComponentType, ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { useAuthStore } from "@/shared/store/auth.store";
import { useUiStore } from "@/shared/store/ui.store";

interface PrivateRouterProps {
  layout?: ComponentType<{ children: ReactNode }>;
}

function PrivateRouter({ layout: Layout }: PrivateRouterProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal("Login to continue to this page");
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return <Navigate to={PAGE_URLS.HOME} replace />;
  }

  if (!Layout) {
    return <Outlet />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default PrivateRouter;
