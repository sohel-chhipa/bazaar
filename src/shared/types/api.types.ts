export interface ApiPaginatedResponse<T> {
  data: T[];
  currentPage: number;
  perPage: number;
  totalPages: number;
  [key: string]: unknown;
}

export interface ApiError {
  title: string;
  message: string;
  code?: string;
}
