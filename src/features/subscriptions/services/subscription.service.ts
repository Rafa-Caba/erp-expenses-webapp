// src/features/subscriptions/services/subscription.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateSubscriptionPayload,
    CreateSubscriptionTransactionPayload,
    SubscriptionResponse,
    SubscriptionsResponse,
    SubscriptionTransactionResponse,
    UpdateSubscriptionPayload,
} from "../types/subscription.types";

export function createSubscriptionService(apiClient: AxiosInstance) {
    return {
        getSubscriptions(workspaceId: string): Promise<SubscriptionsResponse> {
            return apiClient
                .get<SubscriptionsResponse>(`/api/workspaces/${workspaceId}/subscriptions`)
                .then(({ data }) => data);
        },

        getSubscriptionById(
            workspaceId: string,
            subscriptionId: string
        ): Promise<SubscriptionResponse> {
            return apiClient
                .get<SubscriptionResponse>(
                    `/api/workspaces/${workspaceId}/subscriptions/${subscriptionId}`
                )
                .then(({ data }) => data);
        },

        createSubscription(
            workspaceId: string,
            payload: CreateSubscriptionPayload
        ): Promise<SubscriptionResponse> {
            return apiClient
                .post<SubscriptionResponse>(
                    `/api/workspaces/${workspaceId}/subscriptions`,
                    payload
                )
                .then(({ data }) => data);
        },

        updateSubscription(
            workspaceId: string,
            subscriptionId: string,
            payload: UpdateSubscriptionPayload
        ): Promise<SubscriptionResponse> {
            return apiClient
                .patch<SubscriptionResponse>(
                    `/api/workspaces/${workspaceId}/subscriptions/${subscriptionId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteSubscription(
            workspaceId: string,
            subscriptionId: string
        ): Promise<SubscriptionResponse> {
            return apiClient
                .delete<SubscriptionResponse>(
                    `/api/workspaces/${workspaceId}/subscriptions/${subscriptionId}`
                )
                .then(({ data }) => data);
        },

        createTransactionFromSubscription(
            workspaceId: string,
            subscriptionId: string,
            payload: CreateSubscriptionTransactionPayload
        ): Promise<SubscriptionTransactionResponse> {
            return apiClient
                .post<SubscriptionTransactionResponse>(
                    `/api/workspaces/${workspaceId}/subscriptions/${subscriptionId}/create-transaction`,
                    payload
                )
                .then(({ data }) => data);
        },
    };
}