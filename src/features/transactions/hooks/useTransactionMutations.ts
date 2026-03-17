// src/features/transactions/hooks/useTransactionMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { transactionQueryKeys } from "../api/transaction.queryKeys";
import { createTransactionService } from "../services/transaction.service";
import type {
    CreateTransactionPayload,
    TransactionResponse,
    UpdateTransactionPayload,
} from "../types/transaction.types";

const transactionService = createTransactionService(apiClient);

type CreateTransactionMutationPayload = {
    workspaceId: string;
    payload: CreateTransactionPayload;
};

type UpdateTransactionMutationPayload = {
    workspaceId: string;
    transactionId: string;
    payload: UpdateTransactionPayload;
};

type ArchiveTransactionMutationPayload = {
    workspaceId: string;
    transactionId: string;
};

export function useCreateTransactionMutation() {
    const queryClient = useQueryClient();

    return useMutation<TransactionResponse, Error, CreateTransactionMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            transactionService.createTransaction(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: transactionQueryKeys.all,
            });

            queryClient.setQueryData(
                transactionQueryKeys.detail(
                    response.transaction.workspaceId,
                    response.transaction._id
                ),
                response.transaction
            );
        },
    });
}

export function useUpdateTransactionMutation() {
    const queryClient = useQueryClient();

    return useMutation<TransactionResponse, Error, UpdateTransactionMutationPayload>({
        mutationFn: ({ workspaceId, transactionId, payload }) =>
            transactionService.updateTransaction(
                workspaceId,
                transactionId,
                payload
            ),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: transactionQueryKeys.all,
            });

            queryClient.setQueryData(
                transactionQueryKeys.detail(
                    response.transaction.workspaceId,
                    response.transaction._id
                ),
                response.transaction
            );
        },
    });
}

export function useArchiveTransactionMutation() {
    const queryClient = useQueryClient();

    return useMutation<TransactionResponse, Error, ArchiveTransactionMutationPayload>({
        mutationFn: ({ workspaceId, transactionId }) =>
            transactionService.archiveTransaction(workspaceId, transactionId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: transactionQueryKeys.all,
            });

            queryClient.removeQueries({
                queryKey: transactionQueryKeys.detail(
                    response.transaction.workspaceId,
                    response.transaction._id
                ),
            });
        },
    });
}