// src/features/reconciliation/hooks/useReconciliationMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reconciliationQueryKeys } from "../api/reconciliation.queryKeys";
import { createReconciliationService } from "../services/reconciliation.service";
import type {
    CreateReconciliationPayload,
    ReconciliationResponse,
    UpdateReconciliationPayload,
} from "../types/reconciliation.types";

const reconciliationService = createReconciliationService(apiClient);

type CreateReconciliationMutationInput = {
    workspaceId: string;
    payload: CreateReconciliationPayload;
};

type UpdateReconciliationMutationInput = {
    workspaceId: string;
    reconciliationId: string;
    payload: UpdateReconciliationPayload;
};

type DeleteReconciliationMutationInput = {
    workspaceId: string;
    reconciliationId: string;
};

export function useCreateReconciliationMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReconciliationResponse, Error, CreateReconciliationMutationInput>({
        mutationFn: ({ workspaceId, payload }) =>
            reconciliationService.createReconciliation(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reconciliationQueryKeys.all,
            });
        },
    });
}

export function useUpdateReconciliationMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReconciliationResponse, Error, UpdateReconciliationMutationInput>({
        mutationFn: ({ workspaceId, reconciliationId, payload }) =>
            reconciliationService.updateReconciliation(
                workspaceId,
                reconciliationId,
                payload
            ),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: reconciliationQueryKeys.all,
            });

            queryClient.setQueryData(
                reconciliationQueryKeys.detail(
                    response.reconciliation.workspaceId,
                    response.reconciliation.id
                ),
                response
            );
        },
    });
}

export function useDeleteReconciliationMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReconciliationResponse, Error, DeleteReconciliationMutationInput>({
        mutationFn: ({ workspaceId, reconciliationId }) =>
            reconciliationService.deleteReconciliation(workspaceId, reconciliationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reconciliationQueryKeys.all,
            });
        },
    });
}