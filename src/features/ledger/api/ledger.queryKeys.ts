// src/features/ledger/api/ledger.queryKeys.ts

export const ledgerQueryKeys = {
    all: ["ledger"] as const,

    details: () => ["ledger", "detail"] as const,

    detail: (workspaceId: string) => ["ledger", "detail", workspaceId] as const,
};