// src/features/subscriptions/hooks/useSubscriptionsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { subscriptionQueryKeys } from "../api/subscription.queryKeys";
import { createSubscriptionService } from "../services/subscription.service";

const subscriptionService = createSubscriptionService(apiClient);

export function useSubscriptionsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? subscriptionQueryKeys.list(workspaceId)
            : subscriptionQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return subscriptionService.getSubscriptions(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}
