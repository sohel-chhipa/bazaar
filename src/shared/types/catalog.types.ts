export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  badge?: string;
}

export interface Sale {
  id: string;
  title: string;
  image: string;
  date: string;
  discount: string;
  tag: string;
}

export interface Category {
  id: string;
  name: string;
  itemCountLabel: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
}

export interface HeroDealSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  image: string;
  badge: string;
  discountLabel: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface HomeListingPayload {
  dealsProducts: Product[];
  trendingProducts: Product[];
  upcomingSales: Sale[];
  categories: Category[];
  features: Feature[];
  heroDeals: HeroDealSlide[];
  featuredBrands: Brand[];
}
