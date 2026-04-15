// src/features/reconciliation/api/reconciliation.queryKeys.ts

export const reconciliationQueryKeys = {
    all: ["reconciliation"] as const,

    summaries: () => ["reconciliation", "summary"] as const,
    summary: (workspaceId: string, filtersKey: string) =>
        ["reconciliation", "summary", workspaceId, filtersKey] as const,

    lists: () => ["reconciliation", "list"] as const,
    list: (workspaceId: string, filtersKey: string) =>
        ["reconciliation", "list", workspaceId, filtersKey] as const,

    details: () => ["reconciliation", "detail"] as const,
    detail: (workspaceId: string, reconciliationId: string) =>
        ["reconciliation", "detail", workspaceId, reconciliationId] as const,
};