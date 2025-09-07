

export type EntityID = number | string;

export type Record<T> = T;

export interface ApiResponse<T> {
  data: Record<T>[];
  success: boolean;
}



