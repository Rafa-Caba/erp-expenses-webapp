// src/categories/services/category.service.ts

import type { AxiosInstance } from "axios";

import type {
    CategoriesResponse,
    CategoryResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../types/category.types";

export function createCategoryService(apiClient: AxiosInstance) {
    return {
        getCategories(workspaceId: string): Promise<CategoriesResponse> {
            return apiClient
                .get<CategoriesResponse>(`/api/workspaces/${workspaceId}/categories`)
                .then(({ data }) => data);
        },

        getCategoryById(
            workspaceId: string,
            categoryId: string
        ): Promise<CategoryResponse> {
            return apiClient
                .get<CategoryResponse>(
                    `/api/workspaces/${workspaceId}/categories/${categoryId}`
                )
                .then(({ data }) => data);
        },

        createCategory(
            workspaceId: string,
            payload: CreateCategoryPayload
        ): Promise<CategoryResponse> {
            return apiClient
                .post<CategoryResponse>(`/api/workspaces/${workspaceId}/categories`, payload)
                .then(({ data }) => data);
        },

        updateCategory(
            workspaceId: string,
            categoryId: string,
            payload: UpdateCategoryPayload
        ): Promise<CategoryResponse> {
            return apiClient
                .patch<CategoryResponse>(
                    `/api/workspaces/${workspaceId}/categories/${categoryId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        archiveCategory(workspaceId: string, categoryId: string): Promise<CategoryResponse> {
            return apiClient
                .delete<CategoryResponse>(
                    `/api/workspaces/${workspaceId}/categories/${categoryId}`
                )
                .then(({ data }) => data);
        },
    };
}