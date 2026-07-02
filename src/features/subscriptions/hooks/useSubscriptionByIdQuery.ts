// src/features/subscriptions/hooks/useSubscriptionByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { subscriptionQueryKeys } from "../api/subscription.queryKeys";
import { createSubscriptionService } from "../services/subscription.service";
import type { SubscriptionRecord } from "../types/subscription.types";

const subscriptionService = createSubscriptionService(apiClient);

export function useSubscriptionByIdQuery(
    workspaceId: string | null,
    subscriptionId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && subscriptionId
                ? subscriptionQueryKeys.detail(workspaceId, subscriptionId)
                : subscriptionQueryKeys.details(),
        queryFn: async (): Promise<SubscriptionRecord> => {
            if (!workspaceId || !subscriptionId) {
                throw new Error("Workspace ID and subscription ID are required");
            }

            const response = await subscriptionService.getSubscriptionById(
                workspaceId,
                subscriptionId
            );
            return response.subscription;
        },
        enabled: workspaceId !== null && subscriptionId !== null,
        staleTime: 30_000,
    });
}
