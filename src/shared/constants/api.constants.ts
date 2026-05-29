export const API_STATUS_CODE = {
  OK: "OK",
  ERR_CANCELED: "ERR_CANCELED",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;

export const API_URLS = {
  products: {
    list: "/products",
    byId: (id: number) => `/products/${id}`,
    categoryList: "/products/category-list",
  },
  users: {
    list: "/users",
    byId: (id: number) => `/users/${id}`,
  },
  orders: {
    list: "/orders",
    byUser: (userId: number) => `/orders/user/${userId}`,
  },
  coupons: {
    list: "/coupons",
  },
  notifications: {
    list: "/notifications",
    byUser: (userId: number) => `/notifications/user/${userId}`,
  },
} as const;
