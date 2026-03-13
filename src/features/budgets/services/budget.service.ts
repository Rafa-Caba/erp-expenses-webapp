// src/budgets/services/budget.service.ts

import type { AxiosInstance } from "axios";

import type {
    BudgetResponse,
    BudgetsResponse,
    CreateBudgetPayload,
    UpdateBudgetPayload,
} from "../types/budget.types";

export function createBudgetService(apiClient: AxiosInstance) {
    return {
        getBudgets(workspaceId: string): Promise<BudgetsResponse> {
            return apiClient
                .get<BudgetsResponse>(`/api/workspaces/${workspaceId}/budgets`)
                .then(({ data }) => data);
        },

        getBudgetById(workspaceId: string, budgetId: string): Promise<BudgetResponse> {
            return apiClient
                .get<BudgetResponse>(`/api/workspaces/${workspaceId}/budgets/${budgetId}`)
                .then(({ data }) => data);
        },

        createBudget(workspaceId: string, payload: CreateBudgetPayload): Promise<BudgetResponse> {
            return apiClient
                .post<BudgetResponse>(`/api/workspaces/${workspaceId}/budgets`, payload)
                .then(({ data }) => data);
        },

        updateBudget(
            workspaceId: string,
            budgetId: string,
            payload: UpdateBudgetPayload
        ): Promise<BudgetResponse> {
            return apiClient
                .patch<BudgetResponse>(`/api/workspaces/${workspaceId}/budgets/${budgetId}`, payload)
                .then(({ data }) => data);
        },

        deleteBudget(workspaceId: string, budgetId: string): Promise<BudgetResponse> {
            return apiClient
                .delete<BudgetResponse>(`/api/workspaces/${workspaceId}/budgets/${budgetId}`)
                .then(({ data }) => data);
        },
    };
}