import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchProducts } from "@/shared/api/methods/products.methods";
import { PAGE_URLS } from "@/routes/page-urls";
import { useApiError } from "@/shared/hooks/use-api-error";
import { formatCurrency } from "@/shared/lib/format";
import type { Product } from "@/shared/types/ecommerce.types";
import { Input, Modal, RatingStars, SafeImage, Skeleton } from "@/shared/ui";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductSearchModal({ isOpen, onClose }: ProductSearchModalProps) {
  const navigate = useNavigate();
  const { onApiError } = useApiError();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen || hasLoaded) {
      return;
    }

    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const response = await fetchProducts({ page: 1, perPage: 400 });

        if (!isMounted) {
          return;
        }

        setProducts(response.data);
        setHasLoaded(true);
      } catch (error) {
        if (isMounted) {
          onApiError(error, {
            title: "Search unavailable",
            message: "Could not load product index for search.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [hasLoaded, isOpen, onApiError]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusInput = () => {
      const target = searchInputRef.current;
      if (!target) {
        return;
      }

      try {
        target.focus({ preventScroll: true });
      } catch {
        target.focus();
      }
    };

    const timerId = window.setTimeout(focusInput, 20);
    return () => window.clearTimeout(timerId);
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return products.slice(0, 8);
    }

    return products
      .filter((product) => {
        const haystack =
          `${product.title} ${product.brand} ${product.category} ${product.type}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 12);
  }, [products, query]);

  const handleNavigateToProduct = (productId: number) => {
    navigate(PAGE_URLS.PRODUCT_DETAILS.replace(":productId", String(productId)));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showClose={false}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="h-11 border-0 bg-background px-0 focus:ring-0"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[440px] overflow-y-auto rounded-xl border border-border bg-card">
          {isLoading ? (
            <div className="space-y-3 p-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`search-skeleton-${index}`} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length ? (
            <div className="divide-y divide-border" role="listbox" aria-label="Search results">
              {filteredProducts.map((product, index) => (
                <button
                  type="button"
                  key={product._id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => handleNavigateToProduct(product._id)}
                  className={`flex w-full items-center gap-3 p-3 text-left transition ${
                    activeIndex === index ? "bg-secondary" : "hover:bg-secondary"
                  }`}
                  role="option"
                  aria-selected={activeIndex === index}
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                    <SafeImage
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      fallbackTitle="Image unavailable"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">
                      {product.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <RatingStars rating={product.rating} sizeClassName="h-3 w-3" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(product.discountedPrice)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid min-h-40 place-items-center p-6 text-center">
              <p className="text-sm text-muted-foreground">No products matched your search.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
