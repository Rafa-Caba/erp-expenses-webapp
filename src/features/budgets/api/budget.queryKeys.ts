// src/features/budgets/api/budget.queryKeys.ts

export const budgetQueryKeys = {
    all: ["budgets"] as const,

    lists: () => ["budgets", "list"] as const,

    list: (workspaceId: string) => ["budgets", "list", workspaceId] as const,

    details: () => ["budgets", "detail"] as const,

    detail: (workspaceId: string, budgetId: string) =>
        ["budgets", "detail", workspaceId, budgetId] as const,
};