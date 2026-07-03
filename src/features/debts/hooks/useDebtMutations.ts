// src/features/debts/hooks/useDebtMutations.ts
// React Query mutations for debts.
// Phase 10 adds process-due debt payment mutation.

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { paymentQueryKeys } from "../../payments/api/payment.queryKeys";
import { transactionQueryKeys } from "../../transactions/api/transaction.queryKeys";
import { debtQueryKeys } from "../api/debt.queryKeys";
import { createDebtService } from "../services/debt.service";
import type {
    CreateDebtPayload,
    DebtResponse,
    ProcessDueDebtPaymentsPayload,
    ProcessDueDebtPaymentsResponse,
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

type ProcessDueDebtPaymentsMutationPayload = {
    workspaceId: string;
    payload: ProcessDueDebtPaymentsPayload;
};

export function useCreateDebtMutation() {
    const queryClient = useQueryClient();

    return useMutation<DebtResponse, Error, CreateDebtMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            debtService.createDebt(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: debtQueryKeys.all });
            queryClient.setQueryData(
                debtQueryKeys.detail(response.debt.workspaceId, response.debt._id),
                response
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
            queryClient.invalidateQueries({ queryKey: debtQueryKeys.all });
            queryClient.setQueryData(
                debtQueryKeys.detail(response.debt.workspaceId, response.debt._id),
                response
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
            queryClient.invalidateQueries({ queryKey: debtQueryKeys.all });
        },
    });
}

export function useProcessDueDebtPaymentsMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        ProcessDueDebtPaymentsResponse,
        Error,
        ProcessDueDebtPaymentsMutationPayload
    >({
        mutationFn: ({ workspaceId, payload }) =>
            debtService.processDueDebtPayments(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: debtQueryKeys.all });

            if (!response.result.dryRun && response.result.generatedCount > 0) {
                queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
                queryClient.invalidateQueries({ queryKey: paymentQueryKeys.all });
            }
        },
    });
}