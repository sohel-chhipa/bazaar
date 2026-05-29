import { fetchNotificationsByUser } from "@/shared/api/methods/notifications.methods";
import { fetchOrdersByUser } from "@/shared/api/methods/orders.methods";
import type { LocalOrder, RemoteOrder } from "@/shared/types/ecommerce.types";

const mapRemoteOrderToLocalLike = (order: RemoteOrder): LocalOrder => ({
  id: `REMOTE-${order._id}`,
  userId: order.userId,
  createdAt: order.orderDate,
  status: order.status === "Delivered" ? "Placed" : "Processing",
  items: order.items.map((item) => ({
    productId: item.productId,
    title: item.name,
    image: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg",
    price: item.price,
    discountedPrice: item.price,
    quantity: item.quantity,
    stock: 999,
    brand: "External",
  })),
  subtotal: order.totalAmount,
  discount: 0,
  total: order.totalAmount,
  shippingAddress: "Saved delivery address",
  paymentMethod: "Card",
});

const isNotFoundError = (error: unknown) => {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: string }).code ?? "")
      : "";
  return code === "404";
};

export const orderMock = {
  async getOrdersForUser(userId: number, localOrders: LocalOrder[]) {
    const [remoteOrders, notifications] = await Promise.all([
      fetchOrdersByUser(userId).catch((error: unknown) => {
        if (isNotFoundError(error)) {
          return [];
        }
        throw error;
      }),
      fetchNotificationsByUser(userId).catch((error: unknown) => {
        if (isNotFoundError(error)) {
          return [];
        }
        throw error;
      }),
    ]);

    const mapped = remoteOrders.map(mapRemoteOrderToLocalLike);

    return {
      orders: [...localOrders, ...mapped].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
      notifications,
    };
  },
};
