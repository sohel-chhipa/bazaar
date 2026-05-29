import {
  categories,
  dealsProducts,
  featuredBrands,
  features,
  heroDeals,
  trendingProducts,
  upcomingSales,
} from "@/shared/data/home-content.data";
import type { HomeListingPayload } from "@/shared/types/catalog.types";

const simulateLatency = async <T>(payload: T) => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return payload;
};

export const fetchHomeListing = () =>
  simulateLatency({
    dealsProducts,
    trendingProducts,
    upcomingSales,
    categories,
    features,
    heroDeals,
    featuredBrands,
  } satisfies HomeListingPayload);
