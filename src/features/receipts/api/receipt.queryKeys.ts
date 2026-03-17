// src/features/receipts/api/receipt.queryKeys.ts

export const receiptQueryKeys = {
    all: ["receipts"] as const,

    lists: () => ["receipts", "list"] as const,

    list: (workspaceId: string) => ["receipts", "list", workspaceId] as const,

    byTransaction: (workspaceId: string, transactionId: string) =>
        ["receipts", "list", workspaceId, "transaction", transactionId] as const,

    details: () => ["receipts", "detail"] as const,

    detail: (workspaceId: string, receiptId: string) =>
        ["receipts", "detail", workspaceId, receiptId] as const,
};