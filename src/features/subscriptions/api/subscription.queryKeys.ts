// src/features/subscriptions/api/subscription.queryKeys.ts

export const subscriptionQueryKeys = {
    all: ["subscriptions"] as const,

    lists: () => ["subscriptions", "list"] as const,

    list: (workspaceId: string) => ["subscriptions", "list", workspaceId] as const,

    details: () => ["subscriptions", "detail"] as const,

    detail: (workspaceId: string, subscriptionId: string) =>
        ["subscriptions", "detail", workspaceId, subscriptionId] as const,
};