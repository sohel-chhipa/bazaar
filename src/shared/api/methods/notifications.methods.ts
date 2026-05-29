import { API_URLS } from "@/shared/constants/api.constants";
import { httpGet } from "@/shared/api/methods/http.methods";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { Notification } from "@/shared/types/ecommerce.types";

export const fetchNotificationsByUser = (userId: number) =>
  httpGet<Notification[]>(API_URLS.notifications.byUser(userId));

export const fetchNotifications = (params?: { page?: number; perPage?: number }) =>
  httpGet<ApiPaginatedResponse<Notification>>(API_URLS.notifications.list, {
    page: params?.page ?? 1,
    perPage: params?.perPage ?? 20,
  });
