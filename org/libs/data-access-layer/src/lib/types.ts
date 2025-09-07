

export type EntityID = number | string;

export type Record<T> = T;

export interface ApiResponse<T> {
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: T[];
  total: number;
}



