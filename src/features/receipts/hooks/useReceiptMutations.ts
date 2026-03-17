// src/features/receipts/hooks/useReceiptMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { receiptQueryKeys } from "../api/receipt.queryKeys";
import { createReceiptService } from "../services/receipt.service";
import type { ReceiptResponse } from "../types/receipt.types";

const receiptService = createReceiptService(apiClient);

type CreateReceiptMutationPayload = {
    workspaceId: string;
    payload: FormData;
};

type UpdateReceiptMutationPayload = {
    workspaceId: string;
    receiptId: string;
    payload: FormData;
};

type DeleteReceiptMutationPayload = {
    workspaceId: string;
    receiptId: string;
};

export function useCreateReceiptMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReceiptResponse, Error, CreateReceiptMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            receiptService.createReceipt(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: receiptQueryKeys.all,
            });

            queryClient.setQueryData(
                receiptQueryKeys.detail(response.receipt.workspaceId, response.receipt._id),
                response.receipt
            );
        },
    });
}

export function useUpdateReceiptMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReceiptResponse, Error, UpdateReceiptMutationPayload>({
        mutationFn: ({ workspaceId, receiptId, payload }) =>
            receiptService.updateReceipt(workspaceId, receiptId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: receiptQueryKeys.all,
            });

            queryClient.setQueryData(
                receiptQueryKeys.detail(response.receipt.workspaceId, response.receipt._id),
                response.receipt
            );
        },
    });
}

export function useDeleteReceiptMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReceiptResponse, Error, DeleteReceiptMutationPayload>({
        mutationFn: ({ workspaceId, receiptId }) =>
            receiptService.deleteReceipt(workspaceId, receiptId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: receiptQueryKeys.all,
            });

            queryClient.removeQueries({
                queryKey: receiptQueryKeys.detail(response.receipt.workspaceId, response.receipt._id),
            });
        },
    });
}