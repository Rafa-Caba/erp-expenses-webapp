// src/features/categories/hooks/useCategoriesQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { categoryQueryKeys } from "../api/category.queryKeys";
import { createCategoryService } from "../services/category.service";

const categoryService = createCategoryService(apiClient);

export function useCategoriesQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? categoryQueryKeys.list(workspaceId) : categoryQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return categoryService.getCategories(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}