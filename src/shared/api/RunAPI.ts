import { API_STATUS_CODE } from "@/shared/constants/api.constants";
import { useLoadingStore } from "@/shared/store/loading.store";
import { isStandardResponse } from "@/shared/types/base-response.types";

export type ApiFetchPayload<TData = unknown> = {
  data?: TData;
  query?: Record<string, string | number | boolean | undefined>;
  options?: Record<string, unknown> & { signal?: AbortSignal };
};

export type ApiHandler<TData = unknown, TResponse = unknown> = {
  fetch: (payload: ApiFetchPayload<TData>) => Promise<TResponse>;
};

interface RunApiConstructorProps {
  loaderKey?: string;
}

interface RunApiConfig<TData = unknown, TResponse = unknown> {
  apiHandler: ApiHandler<TData, TResponse>;
  onSuccess?: (response: TResponse) => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
  setAbort?: (controller: AbortController) => void;
  loaderKey?: string;
}

const abortControllers = new Map<string, AbortController>();

export class RunAPI<TData = unknown, TResponse = unknown> {
  private apiHandler: ApiHandler<TData, TResponse> | null = null;
  private loaderKey: string | null = null;
  private shouldCallFinally = true;
  private onSuccess?: RunApiConfig<TData, TResponse>["onSuccess"];
  private onError?: RunApiConfig<TData, TResponse>["onError"];
  private onFinally?: RunApiConfig<TData, TResponse>["onFinally"];
  private setAbort?: RunApiConfig<TData, TResponse>["setAbort"];

  constructor(props?: RunApiConstructorProps) {
    this.loaderKey = props?.loaderKey ?? null;
  }

  setConfig(config: RunApiConfig<TData, TResponse>) {
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onFinally = config.onFinally;
    this.setAbort = config.setAbort;
    this.loaderKey = config.loaderKey ?? this.loaderKey;
    this.apiHandler = config.apiHandler;
  }

  async executeFetch(apiPayload: ApiFetchPayload<TData> = {}) {
    if (!this.apiHandler) {
      throw new Error("RunAPI config is not set.");
    }

    this.shouldCallFinally = true;

    const loaderKey = this.loaderKey ?? undefined;
    let controller: AbortController | undefined;

    if (loaderKey) {
      abortControllers.get(loaderKey)?.abort();
      controller = new AbortController();
      abortControllers.set(loaderKey, controller);
      useLoadingStore.getState().setLoading((prev) => ({ ...prev, [loaderKey]: true }));
    }

    if (controller) {
      this.setAbort?.(controller);
    }

    const request = this.apiHandler.fetch({
      ...apiPayload,
      options: {
        ...(apiPayload.options ?? {}),
        ...(controller ? { signal: controller.signal } : {}),
      },
    });

    try {
      const response = await request;

      if (isStandardResponse(response) && response.code === API_STATUS_CODE.OK) {
        this.onSuccess?.((response.data ?? response) as TResponse);
        return;
      }

      if (isStandardResponse(response) && response.code !== API_STATUS_CODE.OK) {
        throw response;
      }

      this.onSuccess?.(response);
    } catch (error) {
      const errorCode =
        typeof error === "object" && error && "code" in error
          ? String((error as { code?: string }).code ?? "")
          : "";

      if (errorCode === API_STATUS_CODE.ERR_CANCELED) {
        this.shouldCallFinally = false;
      } else {
        this.onError?.(error);
      }

      throw error;
    } finally {
      if (this.shouldCallFinally) {
        if (loaderKey) {
          useLoadingStore.getState().setLoading((prev) => ({ ...prev, [loaderKey]: false }));
        }
        this.onFinally?.();
      }
    }
  }
}

export default RunAPI;
