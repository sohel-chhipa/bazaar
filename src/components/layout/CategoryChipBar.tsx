import {
  BookOpen,
  Dumbbell,
  Headphones,
  Home,
  Shirt,
  Smartphone,
  Sparkles,
  Store,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { fetchCategories } from "@/shared/api/methods/categories.methods";
import { PAGE_URLS } from "@/routes/page-urls";
import { cn } from "@/shared/lib/utils";
import type { Category } from "@/shared/types/ecommerce.types";
import { Skeleton } from "@/shared/ui";

const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("elect")) {
    return Smartphone;
  }

  if (
    lowerName.includes("fashion") ||
    lowerName.includes("cloth") ||
    lowerName.includes("apparel")
  ) {
    return Shirt;
  }

  if (lowerName.includes("beauty") || lowerName.includes("cosmetic")) {
    return Sparkles;
  }

  if (lowerName.includes("sport")) {
    return Dumbbell;
  }

  if (lowerName.includes("head") || lowerName.includes("audio")) {
    return Headphones;
  }

  if (lowerName.includes("home")) {
    return Home;
  }

  if (lowerName.includes("book")) {
    return BookOpen;
  }

  return Store;
};

const chipSkeletonLabelWidthClasses = [
  "w-10",
  "w-14",
  "w-12",
  "w-16",
  "w-11",
  "w-[58px]",
  "w-[46px]",
  "w-[52px]",
];

export function CategoryChipBar() {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCategory = useMemo(() => {
    if (location.pathname !== PAGE_URLS.PRODUCTS) {
      return "";
    }

    const params = new URLSearchParams(location.search);
    return params.get("category") ?? "";
  }, [location.pathname, location.search]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setIsLoading(true);

      try {
        const response = await fetchCategories({ page: 1, perPage: 40 });

        if (!isMounted) {
          return;
        }

        setCategories(response.data);
      } catch {
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const chips = useMemo(() => categories.slice(0, 20), [categories]);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary bg-transparent px-3.5 py-2"
                  aria-hidden="true"
                >
                  <Skeleton className="h-3.5 w-3.5 rounded-full bg-primary/20" />
                  <Skeleton
                    className={cn(
                      "h-3 rounded-full bg-primary/20",
                      chipSkeletonLabelWidthClasses[index % chipSkeletonLabelWidthClasses.length],
                    )}
                  />
                </div>
              ))
            : chips.map((category) => {
                const Icon = getCategoryIcon(category.name);
                const isSelected = selectedCategory === category.name;

                return (
                  <Link
                    key={category._id}
                    to={`${PAGE_URLS.PRODUCTS}?category=${encodeURIComponent(category.name)}`}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full border border-primary",
                      "px-3.5 py-2 text-sm font-medium transition",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-transparent text-foreground hover:bg-primary/10",
                    )}
                    aria-current={isSelected ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-3.5 w-3.5",
                        isSelected ? "text-primary-foreground" : "text-primary",
                      )}
                    />
                    <span>{category.name}</span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
