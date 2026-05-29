import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { ProductRail } from "@/components/products/ProductRail";
import { PAGE_URLS } from "@/routes/page-urls";
import { catalogMock } from "@/mocks/services/catalog.mock";
import { useApiError } from "@/shared/hooks/use-api-error";
import { useCartStore } from "@/shared/store/cart.store";
import { useWishlistStore } from "@/shared/store/wishlist.store";
import type { Product, Review } from "@/shared/types/ecommerce.types";
import { Accordion, Badge, Button, RatingStars, SafeImage, Skeleton } from "@/shared/ui";
import { formatCurrency, toSafeNumber } from "@/shared/lib/format";
import { useProtectedAction } from "@/shared/hooks/use-protected-action";

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { onApiError } = useApiError();
  const { goToCheckoutWithAuth } = useProtectedAction();
  const { productId } = useParams();

  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);
  const recentlyViewedIds = useCartStore((state) => state.recentlyViewed);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);

  const numericProductId = Number(productId);

  useEffect(() => {
    if (!Number.isFinite(numericProductId)) {
      navigate(PAGE_URLS.NOT_FOUND, { replace: true });
      return;
    }

    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);

      try {
        const details = await catalogMock.getProductDetails(numericProductId);

        if (!isMounted) {
          return;
        }

        setProduct(details.product);
        setReviews(details.reviews);
        setRelatedProducts(details.relatedProducts);
        setSuggestedProducts(details.suggestedProducts);
        addRecentlyViewed(details.product._id);
      } catch (error) {
        const errorCode =
          typeof error === "object" && error && "code" in error
            ? String((error as { code?: string }).code ?? "")
            : "";
        const message =
          typeof error === "object" && error && "message" in error
            ? String((error as { message?: string }).message ?? "")
            : "";

        if (errorCode === "404" || message.includes("404")) {
          navigate(PAGE_URLS.NOT_FOUND, { replace: true });
          return;
        }

        if (isMounted) {
          onApiError(error, {
            title: "Product unavailable",
            message: "This product could not be loaded right now.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [addRecentlyViewed, navigate, numericProductId, onApiError]);

  useEffect(() => {
    let isMounted = true;

    const loadRecentProducts = async () => {
      if (!recentlyViewedIds.length) {
        setRecentlyViewedProducts([]);
        return;
      }

      try {
        const products = await catalogMock.getRecentlyViewedProducts(
          recentlyViewedIds.slice(0, 10),
        );

        if (isMounted) {
          setRecentlyViewedProducts(products.filter((item) => item._id !== numericProductId));
        }
      } catch {
        if (isMounted) {
          setRecentlyViewedProducts([]);
        }
      }
    };

    void loadRecentProducts();

    return () => {
      isMounted = false;
    };
  }, [numericProductId, recentlyViewedIds]);

  const reviewAverage = useMemo(() => {
    if (!reviews.length) {
      return toSafeNumber(product?.rating);
    }

    const total = reviews.reduce((sum, review) => sum + toSafeNumber(review.rating), 0);
    return total / reviews.length;
  }, [product?.rating, reviews]);
  const isLowStock = toSafeNumber(product?.stock) > 0 && toSafeNumber(product?.stock) < 15;
  const isInCart = Boolean(product && cartItems.some((item) => item.productId === product._id));
  const isWishlisted = Boolean(product && wishlistItems.some((item) => item.productId === product._id));

  const buyNow = () => {
    if (!product) {
      return;
    }

    addToCart(product, quantity);
    goToCheckoutWithAuth();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Try browsing another product from the catalog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-[2rem] border border-[#dccabb] bg-[#fffaf4] p-5 sm:p-7 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-[#dccabb] bg-[#f7ede3]">
          <SafeImage
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
            fallbackTitle="Product image unavailable"
          />
        </div>

        <div className="relative space-y-5">
          <Button
            variant="outline"
            className={
              isWishlisted
                ? "absolute right-0 top-0 z-10 h-10 w-10 rounded-full border border-[#664930] bg-[#664930] text-white hover:bg-[#583d29]"
                : "absolute right-0 top-0 z-10 h-10 w-10 rounded-full border border-[#ccbeb1] bg-white text-[#664930] hover:bg-[#f7ede3]"
            }
            onClick={() => toggleWishlist(product)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{product.category}</Badge>
            <Badge>{product.brand}</Badge>
            {product.isNew ? <Badge variant="success">New arrival</Badge> : null}
          </div>

          <div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{product.title}</h1>
            <RatingStars
              rating={reviewAverage}
              reviewCount={reviews.length || Math.round(toSafeNumber(product.rating) * 21)}
              className="mt-2"
              sizeClassName="h-4 w-4"
            />
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>

          {isLowStock ? (
            <div className="inline-flex w-fit items-center rounded-full border border-[#ccbeb1] bg-[#fff1e5] px-3 py-1 text-xs font-semibold text-[#664930]">
              Only {toSafeNumber(product.stock)} left in stock, hurry up.
            </div>
          ) : null}

          <div className="flex items-end gap-3">
            <p className="text-3xl font-semibold">{formatCurrency(product.discountedPrice)}</p>
            <p className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="inline-flex items-center rounded-xl border border-[#ccbeb1] bg-white">
            <button
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="grid h-10 w-10 place-items-center text-muted-foreground transition hover:text-foreground"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-12 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
              className="grid h-10 w-10 place-items-center text-muted-foreground transition hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {isInCart ? (
              <Button
                variant="secondary"
                className="w-full border border-[#c9b9aa] bg-[#ccbeb1] text-[#4a3523] hover:bg-[#c2b3a4]"
                onClick={() => navigate(PAGE_URLS.CART)}
              >
                Go to cart
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="w-full border border-[#c9b9aa] bg-[#ccbeb1] text-[#4a3523] hover:bg-[#c2b3a4]"
                onClick={() => addToCart(product, quantity)}
              >
                Add to cart
              </Button>
            )}
            <Button
              className="w-full border border-[#664930] bg-[#664930] text-white hover:bg-[#583d29]"
              onClick={buyNow}
            >
              Buy now
            </Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[#dccabb] bg-[#f7ede3] p-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#664930]" />
              Fast dispatch in 24 hours
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#664930]" />
              Secure payments and easy returns
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Product Reviews</h2>
        {reviews.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {reviews.slice(0, 8).map((review) => (
              <article key={review._id} className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <RatingStars rating={toSafeNumber(review.rating)} sizeClassName="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-relaxed text-foreground">{review.comment}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            No reviews yet for this product.
          </div>
        )}
      </section>

      <Accordion
        items={[
          {
            id: "shipping",
            title: "Shipping information",
            content:
              "Standard shipping takes 3-5 business days. Express delivery options are shown at checkout.",
          },
          {
            id: "returns",
            title: "Return and refund policy",
            content:
              "Return unused items within 30 days. Refunds are processed to your original payment method.",
          },
          {
            id: "warranty",
            title: "Product warranty",
            content:
              "Selected brands include manufacturer warranty. Details vary by category and are included on invoice.",
          },
        ]}
      />

      <ProductRail
        title="Related products"
        subtitle="More from the same category"
        products={relatedProducts}
      />

      <ProductRail
        title="Suggested for you"
        subtitle="Popular picks shoppers usually pair with this"
        products={suggestedProducts}
      />

      <ProductRail
        title="Recently viewed"
        subtitle="Quick way to revisit products"
        products={recentlyViewedProducts}
      />
    </div>
  );
}

export default ProductDetailsPage;
