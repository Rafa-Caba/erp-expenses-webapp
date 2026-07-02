// src/features/subscriptions/hooks/useSubscriptionMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { transactionQueryKeys } from "../../transactions/api/transaction.queryKeys";
import { subscriptionQueryKeys } from "../api/subscription.queryKeys";
import { createSubscriptionService } from "../services/subscription.service";
import type {
    CreateSubscriptionPayload,
    CreateSubscriptionTransactionPayload,
    SubscriptionResponse,
    SubscriptionTransactionResponse,
    UpdateSubscriptionPayload,
} from "../types/subscription.types";

const subscriptionService = createSubscriptionService(apiClient);

type CreateSubscriptionMutationPayload = {
    workspaceId: string;
    payload: CreateSubscriptionPayload;
};

type UpdateSubscriptionMutationPayload = {
    workspaceId: string;
    subscriptionId: string;
    payload: UpdateSubscriptionPayload;
};

type DeleteSubscriptionMutationPayload = {
    workspaceId: string;
    subscriptionId: string;
};

type CreateSubscriptionTransactionMutationPayload = {
    workspaceId: string;
    subscriptionId: string;
    payload: CreateSubscriptionTransactionPayload;
};

export function useCreateSubscriptionMutation() {
    const queryClient = useQueryClient();

    return useMutation<SubscriptionResponse, Error, CreateSubscriptionMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            subscriptionService.createSubscription(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.all });
            queryClient.setQueryData(
                subscriptionQueryKeys.detail(
                    response.subscription.workspaceId,
                    response.subscription._id
                ),
                response.subscription
            );
        },
    });
}

export function useUpdateSubscriptionMutation() {
    const queryClient = useQueryClient();

    return useMutation<SubscriptionResponse, Error, UpdateSubscriptionMutationPayload>({
        mutationFn: ({ workspaceId, subscriptionId, payload }) =>
            subscriptionService.updateSubscription(workspaceId, subscriptionId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.all });
            queryClient.setQueryData(
                subscriptionQueryKeys.detail(
                    response.subscription.workspaceId,
                    response.subscription._id
                ),
                response.subscription
            );
        },
    });
}

export function useDeleteSubscriptionMutation() {
    const queryClient = useQueryClient();

    return useMutation<SubscriptionResponse, Error, DeleteSubscriptionMutationPayload>({
        mutationFn: ({ workspaceId, subscriptionId }) =>
            subscriptionService.deleteSubscription(workspaceId, subscriptionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.all });
        },
    });
}

export function useCreateSubscriptionTransactionMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        SubscriptionTransactionResponse,
        Error,
        CreateSubscriptionTransactionMutationPayload
    >({
        mutationFn: ({ workspaceId, subscriptionId, payload }) =>
            subscriptionService.createTransactionFromSubscription(
                workspaceId,
                subscriptionId,
                payload
            ),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: subscriptionQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
            queryClient.setQueryData(
                subscriptionQueryKeys.detail(
                    response.subscription.workspaceId,
                    response.subscription._id
                ),
                response.subscription
            );
        },
    });
}
