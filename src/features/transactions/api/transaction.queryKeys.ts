// src/features/transactions/api/transaction.queryKeys.ts

export const transactionQueryKeys = {
    all: ["transactions"] as const,

    lists: () => ["transactions", "list"] as const,

    list: (workspaceId: string) =>
        ["transactions", "list", workspaceId] as const,

    details: () => ["transactions", "detail"] as const,

    detail: (workspaceId: string, transactionId: string) =>
        ["transactions", "detail", workspaceId, transactionId] as const,
};