/**
 * Pagination interface
 */
export interface Pagination {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

/**
 * API Error response
 */
export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}
