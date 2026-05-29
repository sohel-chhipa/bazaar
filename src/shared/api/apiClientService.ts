import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
  isAxiosError,
} from "axios";

import environment from "@/shared/config/environment";
import { API_STATUS_CODE } from "@/shared/constants/api.constants";
import { useAuthStore } from "@/shared/store/auth.store";
import {
  isStandardErrorResponse,
  isStandardResponse,
  type StandardResponse,
} from "@/shared/types/base-response.types";

export interface ApiClientRequest {
  url: string;
  method?: Method;
  data?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  customHeaders?: Record<string, string>;
  options?: AxiosRequestConfig & {
    handleNonOkCode?: boolean;
    signal?: AbortSignal;
  };
}

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
} as const;

class ApiClientService {
  private static instance: ApiClientService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: environment.apiBaseUrl,
      timeout: environment.apiTimeoutMs,
      headers: DEFAULT_HEADERS,
    });

    this.setupInterceptors();
  }

  public static getInstance() {
    if (!ApiClientService.instance) {
      ApiClientService.instance = new ApiClientService();
    }

    return ApiClientService.instance;
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = useAuthStore.getState().session?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.data && isStandardErrorResponse(error.response.data)) {
          const standardError = error.response.data;

          if (standardError.code === API_STATUS_CODE.UNAUTHORIZED) {
            useAuthStore.getState().logout();
          }
        }

        return Promise.reject(error);
      },
    );
  }

  public async request<T>({
    url,
    method = "GET",
    data,
    query,
    customHeaders = {},
    options = {},
  }: ApiClientRequest): Promise<T> {
    const { handleNonOkCode, signal, ...axiosOptions } = options;

    try {
      const response = await this.axiosInstance.request<T>({
        url,
        method,
        data,
        params: query,
        headers: {
          ...customHeaders,
        },
        signal,
        ...axiosOptions,
      });

      if (!isStandardResponse(response.data)) {
        return response.data;
      }

      const responseData = response.data as StandardResponse<T>;

      if (responseData.code === API_STATUS_CODE.OK || handleNonOkCode) {
        return responseData as T;
      }

      throw responseData;
    } catch (error) {
      if (isAxiosError(error) && error.code === "ERR_CANCELED") {
        throw { code: API_STATUS_CODE.ERR_CANCELED, message: "Request canceled" };
      }

      throw error;
    }
  }
}

const apiClientInstance = ApiClientService.getInstance();

export const apiRequest = <T>(params: ApiClientRequest): Promise<T> =>
  apiClientInstance.request<T>(params);
