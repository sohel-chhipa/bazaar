import { API_URLS } from "@/shared/constants/api.constants";
import { httpGet } from "@/shared/api/methods/http.methods";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { Coupon } from "@/shared/types/ecommerce.types";

export const fetchCoupons = () =>
  httpGet<ApiPaginatedResponse<Coupon>>(API_URLS.coupons.list, {
    page: 1,
    perPage: 100,
  });
