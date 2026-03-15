// src/features/categories/hooks/useCategoryMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { categoryQueryKeys } from "../api/category.queryKeys";
import { createCategoryService } from "../services/category.service";
import type {
    CategoryResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../types/category.types";

const categoryService = createCategoryService(apiClient);

type CreateCategoryMutationPayload = {
    workspaceId: string;
    payload: CreateCategoryPayload;
};

type UpdateCategoryMutationPayload = {
    workspaceId: string;
    categoryId: string;
    payload: UpdateCategoryPayload;
};

type ArchiveCategoryMutationPayload = {
    workspaceId: string;
    categoryId: string;
};

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation<CategoryResponse, Error, CreateCategoryMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            categoryService.createCategory(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.all,
            });

            queryClient.setQueryData(
                categoryQueryKeys.detail(response.category.workspaceId, response.category._id),
                response.category
            );
        },
    });
}

export function useUpdateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation<CategoryResponse, Error, UpdateCategoryMutationPayload>({
        mutationFn: ({ workspaceId, categoryId, payload }) =>
            categoryService.updateCategory(workspaceId, categoryId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.all,
            });

            queryClient.setQueryData(
                categoryQueryKeys.detail(response.category.workspaceId, response.category._id),
                response.category
            );
        },
    });
}

export function useArchiveCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation<CategoryResponse, Error, ArchiveCategoryMutationPayload>({
        mutationFn: ({ workspaceId, categoryId }) =>
            categoryService.archiveCategory(workspaceId, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.all,
            });
        },
    });
}