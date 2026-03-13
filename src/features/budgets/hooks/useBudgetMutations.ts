// src/features/budgets/hooks/useBudgetMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { budgetQueryKeys } from "../api/budget.queryKeys";
import { createBudgetService } from "../services/budget.service";
import type {
    BudgetRecord,
    BudgetResponse,
    CreateBudgetPayload,
    UpdateBudgetPayload,
} from "../types/budget.types";

const budgetService = createBudgetService(apiClient);

type CreateBudgetMutationPayload = {
    workspaceId: string;
    payload: CreateBudgetPayload;
};

type UpdateBudgetMutationPayload = {
    workspaceId: string;
    budgetId: string;
    payload: UpdateBudgetPayload;
};

type DeleteBudgetMutationPayload = {
    workspaceId: string;
    budgetId: string;
};

export function useCreateBudgetMutation() {
    const queryClient = useQueryClient();

    return useMutation<BudgetResponse, Error, CreateBudgetMutationPayload>({
        mutationFn: ({ workspaceId, payload }) => budgetService.createBudget(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: budgetQueryKeys.all,
            });

            queryClient.setQueryData<BudgetRecord>(
                budgetQueryKeys.detail(response.budget.workspaceId, response.budget._id),
                response.budget
            );
        },
    });
}

export function useUpdateBudgetMutation() {
    const queryClient = useQueryClient();

    return useMutation<BudgetResponse, Error, UpdateBudgetMutationPayload>({
        mutationFn: ({ workspaceId, budgetId, payload }) =>
            budgetService.updateBudget(workspaceId, budgetId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: budgetQueryKeys.all,
            });

            queryClient.setQueryData<BudgetRecord>(
                budgetQueryKeys.detail(response.budget.workspaceId, response.budget._id),
                response.budget
            );
        },
    });
}

export function useDeleteBudgetMutation() {
    const queryClient = useQueryClient();

    return useMutation<BudgetResponse, Error, DeleteBudgetMutationPayload>({
        mutationFn: ({ workspaceId, budgetId }) => budgetService.deleteBudget(workspaceId, budgetId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: budgetQueryKeys.all,
            });

            queryClient.removeQueries({
                queryKey: budgetQueryKeys.detail(variables.workspaceId, variables.budgetId),
            });
        },
    });
}