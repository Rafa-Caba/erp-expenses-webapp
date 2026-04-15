// src/features/dashboard/api/dashboard.queryKeys.ts

export const dashboardQueryKeys = {
    all: ["dashboard"] as const,

    monthlySummary: (workspaceId: string, filtersKey: string) =>
        ["dashboard", "monthly-summary", workspaceId, filtersKey] as const,

    categoryBreakdown: (workspaceId: string, filtersKey: string) =>
        ["dashboard", "category-breakdown", workspaceId, filtersKey] as const,

    debtSummary: (workspaceId: string, filtersKey: string) =>
        ["dashboard", "debt-summary", workspaceId, filtersKey] as const,

    budgetSummary: (workspaceId: string, filtersKey: string) =>
        ["dashboard", "budget-summary", workspaceId, filtersKey] as const,

    reconciliationSummary: (workspaceId: string, filtersKey: string) =>
        ["dashboard", "reconciliation-summary", workspaceId, filtersKey] as const,
};