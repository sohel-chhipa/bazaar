import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSearchParams } from "react-router-dom";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { useApiError } from "@/shared/hooks/use-api-error";
import { useCatalogStore } from "@/shared/store/catalog.store";
import { useUiStore } from "@/shared/store/ui.store";
import { Input, Select } from "@/shared/ui";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top rated", value: "rating-desc" },
];

type SortValue = "featured" | "price-asc" | "price-desc" | "rating-desc";
type RatingFilterValue = "0" | "3" | "4";
type DiscountFilterValue = "0" | "20" | "40" | "60";

interface MobileFilterDraft {
  category: string;
  brand: string;
  minRating: RatingFilterValue;
  minDiscountPercent: DiscountFilterValue;
  priceRange: { min: number; max: number };
}

const getColumnCountByViewport = () => {
  if (typeof window === "undefined") {
    return 3;
  }

  const width = window.innerWidth;
  return width >= 1024 ? 3 : width >= 640 ? 2 : 1;
};

function CatalogPage() {
  const { onApiError } = useApiError();
  const globalSearchQuery = useUiStore((state) => state.searchQuery);

  const [searchParams, setSearchParams] = useSearchParams();

  const [sort, setSort] = useState<SortValue>("featured");
  const [brand, setBrand] = useState("all");
  const [minRating, setMinRating] = useState("0");
  const [minDiscountPercent, setMinDiscountPercent] = useState("0");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [columnCount, setColumnCount] = useState(getColumnCountByViewport);
  const [isSortSheetOpen, setSortSheetOpen] = useState(false);
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [isBrandSheetOpen, setBrandSheetOpen] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [mobileFilterDraft, setMobileFilterDraft] = useState<MobileFilterDraft>({
    category: "all",
    brand: "all",
    minRating: "0",
    minDiscountPercent: "0",
    priceRange: { min: 0, max: 1000 },
  });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const gridParentRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredLoadMoreRef = useRef(false);
  const shouldNudgeScrollAfterFetchRef = useRef(false);

  const selectedCategory = searchParams.get("category") ?? "all";

  const categories = useCatalogStore((state) => state.categories);
  const products = useCatalogStore((state) => state.products);
  const totalItems = useCatalogStore((state) => state.totalItems);
  const hasNextPage = useCatalogStore((state) => state.hasNextPage);
  const isLoading = useCatalogStore((state) => state.isLoading);
  const isFetchingNextPage = useCatalogStore((state) => state.isFetchingNextPage);
  const setFilters = useCatalogStore((state) => state.setFilters);
  const loadInitial = useCatalogStore((state) => state.loadInitial);
  const loadMore = useCatalogStore((state) => state.loadMore);
  const rowCount = Math.ceil(products.length / columnCount);
  const isDesktopLayout = columnCount >= 3;
  const isMobileLayout = !isDesktopLayout;

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => gridParentRef.current,
    estimateSize: () => {
      if (columnCount <= 1) return 560;
      if (columnCount === 2) return 500;
      return 436;
    },
    overscan: 12,
  });

  useEffect(() => {
    const resolveColumns = () => {
      const nextColumnCount = getColumnCountByViewport();
      setColumnCount((current) => (current === nextColumnCount ? current : nextColumnCount));
    };

    resolveColumns();
    window.addEventListener("resize", resolveColumns);

    return () => {
      window.removeEventListener("resize", resolveColumns);
    };
  }, []);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [columnCount, rowVirtualizer]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 320);

    return () => {
      window.clearTimeout(timer);
    };
  }, [priceRange]);

  useEffect(() => {
    const node = loadMoreRef.current;
    const root = isDesktopLayout ? gridParentRef.current : null;
    if (!node || isLoading || !hasNextPage || (isDesktopLayout && !root)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) {
          hasTriggeredLoadMoreRef.current = false;
          return;
        }

        if (hasTriggeredLoadMoreRef.current || isFetchingNextPage) {
          return;
        }

        const distanceFromBottom =
          root && isDesktopLayout
            ? root.scrollHeight - root.scrollTop - root.clientHeight
            : node.getBoundingClientRect().bottom - window.innerHeight;
        shouldNudgeScrollAfterFetchRef.current = distanceFromBottom <= 24;
        hasTriggeredLoadMoreRef.current = true;
        void loadMore();
      },
      {
        root,
        rootMargin: isDesktopLayout ? "200px 0px" : "300px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isDesktopLayout, isFetchingNextPage, isLoading, loadMore]);

  useEffect(() => {
    if (isLoading) {
      hasTriggeredLoadMoreRef.current = false;
      shouldNudgeScrollAfterFetchRef.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    if (isFetchingNextPage || !shouldNudgeScrollAfterFetchRef.current) {
      return;
    }

    const root = gridParentRef.current;
    shouldNudgeScrollAfterFetchRef.current = false;

    if (!isDesktopLayout) {
      window.requestAnimationFrame(() => {
        window.scrollBy({
          top: -Math.max(60, Math.round(window.innerHeight * 0.08)),
          left: 0,
          behavior: "auto",
        });
      });
      return;
    }

    if (!root) {
      return;
    }

    window.requestAnimationFrame(() => {
      root.scrollBy({
        top: -Math.max(72, Math.round(root.clientHeight * 0.12)),
        left: 0,
        behavior: "auto",
      });
    });
  }, [isDesktopLayout, isFetchingNextPage, products.length]);

  useEffect(() => {
    setFilters({
      category: selectedCategory,
      query: globalSearchQuery,
      sort,
      brand,
      minPrice: debouncedPriceRange.min,
      maxPrice: debouncedPriceRange.max,
      minRating: Number(minRating),
      minDiscountPercent: Number(minDiscountPercent),
    });

    loadInitial().catch((error) => {
      onApiError(error, {
        title: "Catalog unavailable",
        message: "Products could not be loaded right now.",
      });
    });
  }, [
    brand,
    globalSearchQuery,
    loadInitial,
    minDiscountPercent,
    minRating,
    onApiError,
    debouncedPriceRange.max,
    debouncedPriceRange.min,
    selectedCategory,
    setFilters,
    sort,
  ]);

  const categoryOptions = useMemo(
    () => [
      { label: "All categories", value: "all" },
      ...categories.map((category) => ({ label: category.name, value: category.name })),
    ],
    [categories],
  );
  const brandOptions = useMemo(() => {
    const unique = Array.from(new Set(products.map((item) => item.brand)));
    return [
      { label: "All brands", value: "all" },
      ...unique.map((item) => ({ label: item, value: item })),
    ];
  }, [products]);
  const visibleBrandOptions = useMemo(() => {
    const normalizedQuery = brandSearchQuery.trim().toLowerCase();
    const optionsWithoutAll = brandOptions.filter((item) => item.value !== "all");
    if (!normalizedQuery) {
      return optionsWithoutAll;
    }
    return optionsWithoutAll.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
  }, [brandOptions, brandSearchQuery]);
  const activeFilters = useMemo(() => {
    const items: string[] = [];
    if (globalSearchQuery) items.push(`Search: ${globalSearchQuery}`);
    if (selectedCategory !== "all") items.push(`Category: ${selectedCategory}`);
    if (brand !== "all") items.push(`Brand: ${brand}`);
    if (Number(minRating) > 0) items.push(`${minRating}★+`);
    if (Number(minDiscountPercent) > 0) items.push(`${minDiscountPercent}%+ off`);
    if (debouncedPriceRange.min > 0 || debouncedPriceRange.max < 1000) {
      items.push(`₹${debouncedPriceRange.min} - ₹${debouncedPriceRange.max}`);
    }
    return items;
  }, [
    brand,
    debouncedPriceRange.max,
    debouncedPriceRange.min,
    globalSearchQuery,
    minDiscountPercent,
    minRating,
    selectedCategory,
  ]);

  const ratingOptions: Array<{ label: string; value: RatingFilterValue }> = [
    { label: "Any rating", value: "0" },
    { label: "4★ and above", value: "4" },
    { label: "3★ and above", value: "3" },
  ];

  const discountOptions: Array<{ label: string; value: DiscountFilterValue }> = [
    { label: "Any discount", value: "0" },
    { label: "20%+ off", value: "20" },
    { label: "40%+ off", value: "40" },
    { label: "60%+ off", value: "60" },
  ];

  useEffect(() => {
    if (!isFilterSheetOpen) {
      return;
    }

    setMobileFilterDraft({
      category: selectedCategory,
      brand,
      minRating: minRating as RatingFilterValue,
      minDiscountPercent: minDiscountPercent as DiscountFilterValue,
      priceRange: { ...priceRange },
    });
    setBrandSearchQuery("");
    setBrandSheetOpen(false);
  }, [brand, isFilterSheetOpen, minDiscountPercent, minRating, priceRange, selectedCategory]);

  useEffect(() => {
    if (isDesktopLayout) {
      setSortSheetOpen(false);
      setFilterSheetOpen(false);
      setBrandSheetOpen(false);
    }
  }, [isDesktopLayout]);

  const applyMobileFilters = () => {
    const nextCategory = mobileFilterDraft.category;
    const nextBrand = mobileFilterDraft.brand;
    const nextMinRating = mobileFilterDraft.minRating;
    const nextDiscount = mobileFilterDraft.minDiscountPercent;
    const nextPriceRange = mobileFilterDraft.priceRange;

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextCategory === "all") next.delete("category");
      else next.set("category", nextCategory);
      return next;
    });
    setBrand(nextBrand);
    setMinRating(nextMinRating);
    setMinDiscountPercent(nextDiscount);
    setPriceRange(nextPriceRange);
    setBrandSheetOpen(false);
    setFilterSheetOpen(false);
  };

  const resetMobileFilters = () => {
    setMobileFilterDraft({
      category: "all",
      brand: "all",
      minRating: "0",
      minDiscountPercent: "0",
      priceRange: { min: 0, max: 1000 },
    });
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:h-[calc(100vh-8rem)] lg:gap-6 lg:overflow-hidden lg:grid-cols-[240px_1fr]">
          <aside className="hidden space-y-4 rounded-2xl bg-card p-4 sm:p-5 lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filters
            </div>
            <Select
              value={selectedCategory}
              options={categoryOptions}
              onChange={(event) => {
                setSearchParams((current) => {
                  const next = new URLSearchParams(current);
                  if (event.target.value === "all") next.delete("category");
                  else next.set("category", event.target.value);
                  return next;
                });
              }}
            />
            <Select
              value={brand}
              options={brandOptions}
              onChange={(event) => setBrand(event.target.value)}
            />
            <Select
              value={minRating}
              options={ratingOptions}
              onChange={(event) => setMinRating(event.target.value)}
            />
            <Select
              value={minDiscountPercent}
              options={discountOptions}
              onChange={(event) => setMinDiscountPercent(event.target.value)}
            />
            <div className="space-y-2 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground">Price range</p>
              <p className="text-sm font-medium text-foreground">
                ₹{priceRange.min} - ₹{priceRange.max}
              </p>
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={priceRange.min}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  setPriceRange((current) => ({
                    ...current,
                    min: Math.min(nextMin, current.max - 10),
                  }));
                }}
                className="w-full accent-primary"
              />
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={priceRange.max}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  setPriceRange((current) => ({
                    ...current,
                    max: Math.max(nextMax, current.min + 10),
                  }));
                }}
                className="w-full accent-primary"
              />
            </div>
          </aside>

          <section className="flex min-h-0 flex-col space-y-4">
            <div
              className={
                isMobileLayout
                  ? "sticky top-16 z-20 -mx-1 space-y-3 rounded-2xl bg-background/95 px-1 py-2 backdrop-blur-sm"
                  : "space-y-3"
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Shop Products</h1>
                {isDesktopLayout ? (
                  <div className="w-full sm:w-[220px]">
                    <Select
                      value={sort}
                      options={sortOptions}
                      onChange={(event) => setSort(event.target.value as SortValue)}
                    />
                  </div>
                ) : null}
              </div>

              {isMobileLayout ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSortSheetOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterSheetOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFilters.length ? (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">
                        {activeFilters.length}
                      </span>
                    ) : null}
                  </button>
                </div>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground">{totalItems} products found</p>
            {activeFilters.length ? (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            {isLoading ? (
              <div className="min-h-0 flex-1 overflow-hidden">
                <div
                  className="grid w-full gap-4"
                  style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: Math.max(12, columnCount * 4) }).map((_, index) => (
                    <ProductCardSkeleton key={`initial-skeleton-${index}`} />
                  ))}
                </div>
              </div>
            ) : products.length ? (
              <div
                ref={gridParentRef}
                className={`no-scrollbar min-h-0 flex-1 ${
                  isDesktopLayout ? "overflow-y-auto overscroll-contain" : "overflow-visible"
                }`}
              >
                {isDesktopLayout ? (
                  <div
                    className="relative w-full"
                    style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const rowStartIndex = virtualRow.index * columnCount;
                      const rowProducts = products.slice(
                        rowStartIndex,
                        rowStartIndex + columnCount,
                      );

                      return (
                        <div
                          key={virtualRow.key}
                          className="absolute left-0 top-0 grid w-full gap-4"
                          style={{
                            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          {rowProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="grid w-full gap-4"
                    style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                  >
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
                {hasNextPage ? (
                  <div ref={loadMoreRef} className="py-3">
                    <div
                      className="grid w-full gap-4"
                      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                    >
                      {Array.from({ length: columnCount }).map((_, index) => (
                        <ProductCardSkeleton key={`load-more-skeleton-${index}`} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl bg-card p-6 text-center">
                <h3 className="text-lg font-semibold">No products matched your filters</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another category or clear your search query.
                </p>
              </div>
            )}

            <section className="pb-8 pt-2 text-center" />
          </section>
        </div>
      </div>

      {isMobileLayout && isSortSheetOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-black/40"
          onClick={() => setSortSheetOpen(false)}
          role="presentation"
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-4 shadow-soft"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Sort by
              </h3>
              <button type="button" onClick={() => setSortSheetOpen(false)} aria-label="Close sort">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1">
              {sortOptions.map((option) => (
                <button
                  key={`mobile-sort-${option.value}`}
                  type="button"
                  onClick={() => {
                    setSort(option.value as SortValue);
                    setSortSheetOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-secondary"
                >
                  <span>{option.label}</span>
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${
                      sort === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {sort === option.value ? <Check className="h-3 w-3" /> : null}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isMobileLayout && isFilterSheetOpen ? (
        <div className="fixed inset-0 z-[95] bg-background">
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground"
                onClick={() => {
                  if (isBrandSheetOpen) setBrandSheetOpen(false);
                  else setFilterSheetOpen(false);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h3 className="text-base font-semibold">
                {isBrandSheetOpen ? "All Brands" : "Filter"}
              </h3>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground"
                onClick={() => {
                  if (isBrandSheetOpen) {
                    setBrandSearchQuery("");
                    setMobileFilterDraft((current) => ({ ...current, brand: "all" }));
                  } else {
                    resetMobileFilters();
                  }
                }}
              >
                Reset
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isBrandSheetOpen ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={brandSearchQuery}
                      onChange={(event) => setBrandSearchQuery(event.target.value)}
                      placeholder="Search brands"
                      className="pl-9"
                    />
                  </div>
                  <div className="space-y-1">
                    {visibleBrandOptions.map((option) => {
                      const selected = mobileFilterDraft.brand === option.value;
                      return (
                        <button
                          key={`mobile-brand-option-${option.value}`}
                          type="button"
                          onClick={() =>
                            setMobileFilterDraft((current) => ({
                              ...current,
                              brand: option.value,
                            }))
                          }
                          className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-secondary"
                        >
                          <span>{option.label}</span>
                          <span
                            className={`grid h-4 w-4 place-items-center rounded border ${
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            }`}
                          >
                            {selected ? <Check className="h-3 w-3" /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <section className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Category</h4>
                    </div>
                    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                      {categoryOptions.map((option) => {
                        const selected = mobileFilterDraft.category === option.value;
                        return (
                          <button
                            key={`mobile-category-${option.value}`}
                            type="button"
                            onClick={() =>
                              setMobileFilterDraft((current) => ({
                                ...current,
                                category: option.value,
                              }))
                            }
                            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "border border-border bg-card text-foreground"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setBrandSheetOpen(true)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <h4 className="text-sm font-semibold">Brand</h4>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        View all
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <p className="text-sm text-foreground">
                      {mobileFilterDraft.brand === "all" ? "All brands" : mobileFilterDraft.brand}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Price Range</h4>
                      <span className="text-xs text-muted-foreground">
                        ₹{mobileFilterDraft.priceRange.min} - ₹{mobileFilterDraft.priceRange.max}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={10}
                      value={mobileFilterDraft.priceRange.min}
                      onChange={(event) => {
                        const nextMin = Number(event.target.value);
                        setMobileFilterDraft((current) => ({
                          ...current,
                          priceRange: {
                            ...current.priceRange,
                            min: Math.min(nextMin, current.priceRange.max - 10),
                          },
                        }));
                      }}
                      className="w-full accent-primary"
                    />
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={10}
                      value={mobileFilterDraft.priceRange.max}
                      onChange={(event) => {
                        const nextMax = Number(event.target.value);
                        setMobileFilterDraft((current) => ({
                          ...current,
                          priceRange: {
                            ...current.priceRange,
                            max: Math.max(nextMax, current.priceRange.min + 10),
                          },
                        }));
                      }}
                      className="w-full accent-primary"
                    />
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-sm font-semibold">Customer Review</h4>
                    <div className="space-y-1">
                      {ratingOptions.map((option) => {
                        const selected = mobileFilterDraft.minRating === option.value;
                        return (
                          <button
                            key={`mobile-rating-${option.value}`}
                            type="button"
                            onClick={() =>
                              setMobileFilterDraft((current) => ({
                                ...current,
                                minRating: option.value,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-secondary"
                          >
                            <span>{option.label}</span>
                            <span
                              className={`grid h-4 w-4 place-items-center rounded-full border ${
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {selected ? <Check className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h4 className="text-sm font-semibold">Discount</h4>
                    <div className="space-y-1">
                      {discountOptions.map((option) => {
                        const selected = mobileFilterDraft.minDiscountPercent === option.value;
                        return (
                          <button
                            key={`mobile-discount-${option.value}`}
                            type="button"
                            onClick={() =>
                              setMobileFilterDraft((current) => ({
                                ...current,
                                minDiscountPercent: option.value,
                              }))
                            }
                            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-secondary"
                          >
                            <span>{option.label}</span>
                            <span
                              className={`grid h-4 w-4 place-items-center rounded-full border ${
                                selected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {selected ? <Check className="h-3 w-3" /> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={applyMobileFilters}
                className="h-11 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Show {totalItems} results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default CatalogPage;
