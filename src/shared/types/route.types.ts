import type { ComponentType, ReactNode } from "react";

export interface RouteConfig {
  path: string;
  title: string;
  element: ComponentType;
  layout?: ComponentType<{ children: ReactNode }>;
}
