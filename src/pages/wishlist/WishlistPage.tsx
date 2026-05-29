import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { ProductCard } from "@/components/products/ProductCard";
import { PAGE_URLS } from "@/routes/page-urls";
import { useWishlistStore } from "@/shared/store/wishlist.store";
import type { Product } from "@/shared/types/ecommerce.types";

function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const products: Product[] = wishlistItems.map((item) => ({
    _id: item.productId,
    title: item.title,
    isNew: item.isNew,
    oldPrice: String(item.price),
    price: item.price,
    discountedPrice: item.discountedPrice,
    description: "",
    category: item.category,
    type: "",
    stock: item.stock,
    brand: item.brand,
    size: [],
    image: item.image,
    rating: item.rating,
  }));

  if (!products.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid min-h-[320px] place-items-center rounded-[2rem] border border-border bg-card p-8 text-center">
          <div className="max-w-md space-y-3">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Your wishlist is empty</h1>
            <p className="text-sm text-muted-foreground">
              Save products you love and revisit them anytime.
            </p>
            <Link
              to={PAGE_URLS.PRODUCTS}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore products
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">My Wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {products.length} saved {products.length === 1 ? "item" : "items"}.
        </p>
      </section>

      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </div>
  );
}

export default WishlistPage;
