// src/features/accounts/api/account.queryKeys.ts

export const accountQueryKeys = {
    all: ["accounts"] as const,

    lists: () => ["accounts", "list"] as const,

    list: (workspaceId: string) => ["accounts", "list", workspaceId] as const,

    details: () => ["accounts", "detail"] as const,

    detail: (workspaceId: string, accountId: string) =>
        ["accounts", "detail", workspaceId, accountId] as const,
};