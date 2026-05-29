import BaseLayout from "@/layout/base-layout/BaseLayout";
import CartPage from "@/pages/cart/CartPage";
import CheckoutPage from "@/pages/checkout/CheckoutPage";
import PaymentOtpPage from "@/pages/checkout/PaymentOtpPage";
import HomePage from "@/pages/home/HomePage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import OrderPlacedPage from "@/pages/orders/OrderPlacedPage";
import OrderDetailsPage from "@/pages/orders/OrderDetailsPage";
import MyOrdersPage from "@/pages/orders/OrdersPage";
import CatalogPage from "@/pages/catalog/CatalogPage";
import ProductDetailsPage from "@/pages/product/ProductDetailsPage";
import WishlistPage from "@/pages/wishlist/WishlistPage";
import { PAGE_URLS } from "@/routes/page-urls";
import type { RouteConfig } from "@/shared/types/route.types";

export const publicRouteList: RouteConfig[] = [
  {
    path: PAGE_URLS.HOME,
    title: "Home",
    element: HomePage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.PRODUCTS,
    title: "Products",
    element: CatalogPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.PRODUCT_DETAILS,
    title: "Product details",
    element: ProductDetailsPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.WISHLIST,
    title: "Wishlist",
    element: WishlistPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.CART,
    title: "Cart",
    element: CartPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.NOT_FOUND,
    title: "Not Found",
    element: NotFoundPage,
    layout: BaseLayout,
  },
];

export const privateRouteList: RouteConfig[] = [
  {
    path: PAGE_URLS.CHECKOUT,
    title: "Checkout",
    element: CheckoutPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.ORDER_PLACED,
    title: "Order placed",
    element: OrderPlacedPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.PAYMENT_OTP,
    title: "Payment OTP",
    element: PaymentOtpPage,
  },
  {
    path: PAGE_URLS.MY_ORDERS,
    title: "My orders",
    element: MyOrdersPage,
    layout: BaseLayout,
  },
  {
    path: PAGE_URLS.ORDER_DETAILS,
    title: "Order details",
    element: OrderDetailsPage,
    layout: BaseLayout,
  },
];
