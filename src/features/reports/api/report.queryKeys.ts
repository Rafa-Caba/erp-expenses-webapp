// src/features/reports/api/report.queryKeys.ts

import type { ReportFilters } from "../types/report.types";

export const reportQueryKeys = {
    all: ["reports"] as const,

    lists: () => ["reports", "list"] as const,

    list: (workspaceId: string) => ["reports", "list", workspaceId] as const,

    details: () => ["reports", "detail"] as const,

    detail: (workspaceId: string, reportId: string) =>
        ["reports", "detail", workspaceId, reportId] as const,

    analytics: () => ["reports", "analytics"] as const,

    monthlySummary: (workspaceId: string, filters: ReportFilters) =>
        ["reports", "analytics", "monthly-summary", workspaceId, filters] as const,

    categoryBreakdown: (workspaceId: string, filters: ReportFilters) =>
        ["reports", "analytics", "category-breakdown", workspaceId, filters] as const,

    debtSummary: (workspaceId: string, filters: ReportFilters) =>
        ["reports", "analytics", "debt-summary", workspaceId, filters] as const,

    budgetSummary: (workspaceId: string, filters: ReportFilters) =>
        ["reports", "analytics", "budget-summary", workspaceId, filters] as const,
};