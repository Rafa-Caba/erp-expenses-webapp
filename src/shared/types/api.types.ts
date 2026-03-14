// src/shared/types/api.types.ts

export interface ApiMessageResponse {
    message: string;
}

export interface ApiErrorResponse {
    code?: string;
    message: string;
}

export type AxiosLikeError = Error & {
    response?: {
        data?: ApiErrorResponse;
    };
};

export interface ApiValidationIssues {
    formErrors: string[];
    fieldErrors: Record<string, string[]>;
}

export interface ApiValidationErrorResponse {
    message: string;
    issues: ApiValidationIssues;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export type CollectionResponse<K extends string, T> = ApiMessageResponse & Record<K, T[]>;
export type EntityResponse<K extends string, T> = ApiMessageResponse & Record<K, T>;