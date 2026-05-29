import { API_URLS } from "@/shared/constants/api.constants";
import {
  mapDummyUserToUser,
  toPaginatedMeta,
  type DummyListResponse,
} from "@/shared/lib/dummy-adapters";
import { httpGet } from "@/shared/api/methods/http.methods";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { User } from "@/shared/types/ecommerce.types";

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  email: string;
  phone?: string;
  username?: string;
  role?: string;
}

export const fetchUsers = async (params?: { page?: number; perPage?: number }) => {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 100;
  const skip = (page - 1) * perPage;

  const response = await httpGet<DummyListResponse<DummyUser>>(API_URLS.users.list, {
    limit: perPage,
    skip,
  });

  return {
    data: (response.users ?? []).map(mapDummyUserToUser),
    ...toPaginatedMeta(response.total, response.skip, response.limit),
  } as ApiPaginatedResponse<User>;
};

export const fetchUserById = async (userId: number) => {
  const response = await httpGet<DummyUser>(API_URLS.users.byId(userId));
  return mapDummyUserToUser(response);
};
