import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { CategoryChipBar } from "@/components/layout/CategoryChipBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { PAGE_URLS } from "@/routes/page-urls";

interface BaseLayoutProps {
  children: ReactNode;
}

function BaseLayout({ children }: BaseLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === PAGE_URLS.HOME;

  return (
    <div className={`flex min-h-screen flex-col bg-background text-foreground ${isHomePage ? "home-gradient-surface" : ""}`}>
      <AppHeader />
      <CategoryChipBar />
      <div className="flex flex-1 flex-col pb-24 lg:pb-0">
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
      <MobileBottomBar />
    </div>
  );
}

export default BaseLayout;
