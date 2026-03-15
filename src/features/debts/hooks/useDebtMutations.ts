// src/features/debts/hooks/useDebtMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { debtQueryKeys } from "../api/debt.queryKeys";
import { createDebtService } from "../services/debt.service";
import type {
    CreateDebtPayload,
    DebtResponse,
    UpdateDebtPayload,
} from "../types/debt.types";

const debtService = createDebtService(apiClient);

type CreateDebtMutationPayload = {
    workspaceId: string;
    payload: CreateDebtPayload;
};

type UpdateDebtMutationPayload = {
    workspaceId: string;
    debtId: string;
    payload: UpdateDebtPayload;
};

type DeleteDebtMutationPayload = {
    workspaceId: string;
    debtId: string;
};

export function useCreateDebtMutation() {
    const queryClient = useQueryClient();

    return useMutation<DebtResponse, Error, CreateDebtMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            debtService.createDebt(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: debtQueryKeys.all,
            });

            queryClient.setQueryData(
                debtQueryKeys.detail(response.debt.workspaceId, response.debt._id),
                response.debt
            );
        },
    });
}

export function useUpdateDebtMutation() {
    const queryClient = useQueryClient();

    return useMutation<DebtResponse, Error, UpdateDebtMutationPayload>({
        mutationFn: ({ workspaceId, debtId, payload }) =>
            debtService.updateDebt(workspaceId, debtId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: debtQueryKeys.all,
            });

            queryClient.setQueryData(
                debtQueryKeys.detail(response.debt.workspaceId, response.debt._id),
                response.debt
            );
        },
    });
}

export function useDeleteDebtMutation() {
    const queryClient = useQueryClient();

    return useMutation<DebtResponse, Error, DeleteDebtMutationPayload>({
        mutationFn: ({ workspaceId, debtId }) =>
            debtService.deleteDebt(workspaceId, debtId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: debtQueryKeys.all,
            });
        },
    });
}