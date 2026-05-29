import {
  Dumbbell,
  Headphones,
  Home,
  type LucideIcon,
  ShoppingCart,
  Shirt,
  Smartphone,
  Sparkles,
} from "lucide-react";

import type { Category } from "@/shared/types/catalog.types";

const categoryIconMap: Record<string, LucideIcon> = {
  Electronics: Smartphone,
  Fashion: Shirt,
  Beauty: Sparkles,
  Home,
  Sports: Dumbbell,
  Gadgets: Headphones,
  Grocery: ShoppingCart,
};

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  return (
    <section id="categories" className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 py-3 sm:py-4">
          {categories.map((category) => {
            const Icon = categoryIconMap[category.name] ?? ShoppingCart;

            return (
              <a
                key={category.id}
                href="#"
                className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-secondary"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-background text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">{category.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
