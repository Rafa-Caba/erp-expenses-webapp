// src/features/payments/api/payment.queryKeys.ts

export const paymentQueryKeys = {
    all: ["payments"] as const,

    lists: () => ["payments", "list"] as const,

    list: (workspaceId: string) => ["payments", "list", workspaceId] as const,

    details: () => ["payments", "detail"] as const,

    detail: (workspaceId: string, paymentId: string) =>
        ["payments", "detail", workspaceId, paymentId] as const,
};