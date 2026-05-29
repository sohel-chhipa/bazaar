import { API_URLS } from "@/shared/constants/api.constants";
import { httpGet } from "@/shared/api/methods/http.methods";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { RemoteOrder } from "@/shared/types/ecommerce.types";

export const fetchOrders = (params?: { page?: number; perPage?: number }) =>
  httpGet<ApiPaginatedResponse<RemoteOrder>>(API_URLS.orders.list, {
    page: params?.page ?? 1,
    perPage: params?.perPage ?? 100,
  });

export const fetchOrdersByUser = (userId: number) =>
  httpGet<RemoteOrder[]>(API_URLS.orders.byUser(userId));
