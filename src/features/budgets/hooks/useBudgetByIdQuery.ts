// src/features/budgets/hooks/useBudgetByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { budgetQueryKeys } from "../api/budget.queryKeys";
import { createBudgetService } from "../services/budget.service";
import type { BudgetRecord } from "../types/budget.types";

const budgetService = createBudgetService(apiClient);

export function useBudgetByIdQuery(workspaceId: string | null, budgetId: string | null) {
    return useQuery({
        queryKey:
            workspaceId && budgetId
                ? budgetQueryKeys.detail(workspaceId, budgetId)
                : budgetQueryKeys.details(),
        queryFn: async (): Promise<BudgetRecord> => {
            if (!workspaceId || !budgetId) {
                throw new Error("Workspace ID and budget ID are required");
            }

            const response = await budgetService.getBudgetById(workspaceId, budgetId);
            return response.budget;
        },
        enabled: workspaceId !== null && budgetId !== null,
        staleTime: 30_000,
    });
}