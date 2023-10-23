import { PaginationI } from "@interfaces/common/pagination.interface";

export interface ApiResponseI {
  code: number;
  status: string;
  message: string;
  data?: undefined | object | unknown;
  errors?: unknown[];
  meta?: PaginationI;
}