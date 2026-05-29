export interface Product {
  _id: number;
  title: string;
  isNew: boolean;
  oldPrice: string;
  price: number;
  discountedPrice: number;
  description: string;
  category: string;
  type: string;
  stock: number;
  brand: string;
  size: string[];
  image: string;
  rating: number;
}

export interface Category {
  _id: number;
  name: string;
  description: string;
  parentId: number | null;
}

export interface Review {
  _id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  _id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
}

export interface RemoteOrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface RemoteOrder {
  _id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: RemoteOrderItem[];
}

export interface Coupon {
  _id: number;
  code: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  status: string;
}

export interface Notification {
  _id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  title: string;
  image: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  stock: number;
  brand: string;
}

export interface WishlistItem {
  productId: number;
  title: string;
  image: string;
  price: number;
  discountedPrice: number;
  stock: number;
  brand: string;
  category: string;
  rating: number;
  isNew: boolean;
}

export interface LocalOrder {
  id: string;
  userId: number;
  createdAt: string;
  status: "Processing" | "Placed";
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  promoCode?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: AuthSession | null;
}
