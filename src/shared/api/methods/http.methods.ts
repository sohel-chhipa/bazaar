import { apiRequest, type ApiClientRequest } from "@/shared/api/apiClientService";

export const httpGet = <T>(
  url: string,
  query?: ApiClientRequest["query"],
  options?: ApiClientRequest["options"],
) => apiRequest<T>({ url, method: "GET", query, options });

export const httpPost = <T>(url: string, data?: unknown, options?: ApiClientRequest["options"]) =>
  apiRequest<T>({ url, method: "POST", data, options });

export const httpPut = <T>(url: string, data?: unknown, options?: ApiClientRequest["options"]) =>
  apiRequest<T>({ url, method: "PUT", data, options });

export const httpDelete = <T>(url: string, options?: ApiClientRequest["options"]) =>
  apiRequest<T>({ url, method: "DELETE", options });
