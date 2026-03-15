// src/features/debts/api/debt.queryKeys.ts

export const debtQueryKeys = {
    all: ["debts"] as const,

    lists: () => ["debts", "list"] as const,

    list: (workspaceId: string) => ["debts", "list", workspaceId] as const,

    details: () => ["debts", "detail"] as const,

    detail: (workspaceId: string, debtId: string) =>
        ["debts", "detail", workspaceId, debtId] as const,
};