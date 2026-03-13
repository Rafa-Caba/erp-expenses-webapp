// src/features/budgets/hooks/useBudgetsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { budgetQueryKeys } from "../api/budget.queryKeys";
import { createBudgetService } from "../services/budget.service";

const budgetService = createBudgetService(apiClient);

export function useBudgetsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? budgetQueryKeys.list(workspaceId) : budgetQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return budgetService.getBudgets(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}