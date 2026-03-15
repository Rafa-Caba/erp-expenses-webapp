// src/features/categories/hooks/useCategoryByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { categoryQueryKeys } from "../api/category.queryKeys";
import { createCategoryService } from "../services/category.service";
import type { CategoryRecord } from "../types/category.types";

const categoryService = createCategoryService(apiClient);

export function useCategoryByIdQuery(workspaceId: string | null, categoryId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && categoryId
                ? categoryQueryKeys.detail(workspaceId, categoryId)
                : categoryQueryKeys.details(),
        queryFn: async (): Promise<CategoryRecord> => {
            if (!workspaceId || !categoryId) {
                throw new Error("Workspace ID and category ID are required");
            }

            const response = await categoryService.getCategoryById(workspaceId, categoryId);
            return response.category;
        },
        enabled: workspaceId !== null && categoryId !== null,
        staleTime: 30_000,
    });
}