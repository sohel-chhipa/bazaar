export const SITE_META = {
  appName: "Bazaar",
  title: "Bazaar - Shop the vibe, live the drip",
  description:
    "Discover thousands of products, daily flash sales, and limited-time offers on Bazaar's ecommerce platform.",
};

export const NAVIGATION_LINKS = [
  { label: "Deals", href: "#deals" },
  { label: "Categories", href: "#categories" },
  { label: "New Arrivals", href: "#trending" },
  { label: "Best Sellers", href: "#trending" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: ["New Arrivals", "Best Sellers", "Deals", "Gift Cards", "Brands"],
  },
  {
    title: "Categories",
    links: ["Electronics", "Fashion", "Beauty", "Home", "Sports"],
  },
  {
    title: "Support",
    links: ["Help Center", "Order Status", "Returns", "Shipping", "Contact"],
  },
] as const;
