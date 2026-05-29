export type StandardResponse<T = unknown> = {
  code: string;
  data: T;
  status: number;
  message: string;
};

export type StandardErrorResponse<T = unknown> = {
  code: string;
  data?: T;
  status?: number;
  message: string;
};

export const isStandardResponse = <T>(data: unknown): data is StandardResponse<T> =>
  data !== null &&
  typeof data === "object" &&
  "code" in data &&
  "data" in data &&
  "status" in data &&
  "message" in data;

export const isStandardErrorResponse = <T>(data: unknown): data is StandardErrorResponse<T> =>
  data !== null && typeof data === "object" && "code" in data && "message" in data;
