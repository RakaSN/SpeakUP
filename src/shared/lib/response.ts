import { NextResponse } from 'next/server';
import { ErrorCode } from './errors';

export interface PaginationRequest {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationResponse;
  error?: {
    code: ErrorCode | string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export const ResponseFormatter = {
  success<T>(data: T, meta?: PaginationResponse, statusCode = 200) {
    const response: ApiResponse<T> = { success: true, data };
    if (meta) response.meta = meta;
    return NextResponse.json(response, { status: statusCode });
  },

  error(code: ErrorCode | string, message: string, statusCode = 400, details?: Record<string, unknown>) {
    const response: ApiResponse<null> = {
      success: false,
      error: { code, message, details },
    };
    return NextResponse.json(response, { status: statusCode });
  },
};
