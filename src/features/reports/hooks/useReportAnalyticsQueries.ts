// src/features/reports/hooks/useReportAnalyticsQueries.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reportQueryKeys } from "../api/report.queryKeys";
import { createReportService } from "../services/report.service";
import type {
    BudgetSummaryReport,
    CategoryBreakdownReport,
    DebtSummaryReport,
    MonthlySummaryReport,
    ReportFilters,
} from "../types/report.types";

const reportService = createReportService(apiClient);

export function useMonthlySummaryQuery(
    workspaceId: string | null,
    filters: ReportFilters
) {
    return useQuery({
        queryKey: workspaceId
            ? reportQueryKeys.monthlySummary(workspaceId, filters)
            : reportQueryKeys.analytics(),
        queryFn: async (): Promise<MonthlySummaryReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getMonthlySummary(workspaceId, filters);

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}

export function useCategoryBreakdownQuery(
    workspaceId: string | null,
    filters: ReportFilters
) {
    return useQuery({
        queryKey: workspaceId
            ? reportQueryKeys.categoryBreakdown(workspaceId, filters)
            : reportQueryKeys.analytics(),
        queryFn: async (): Promise<CategoryBreakdownReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getCategoryBreakdown(
                workspaceId,
                filters
            );

            return response.breakdown;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}

export function useDebtSummaryQuery(
    workspaceId: string | null,
    filters: ReportFilters
) {
    return useQuery({
        queryKey: workspaceId
            ? reportQueryKeys.debtSummary(workspaceId, filters)
            : reportQueryKeys.analytics(),
        queryFn: async (): Promise<DebtSummaryReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getDebtSummary(workspaceId, filters);

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}

export function useBudgetSummaryQuery(
    workspaceId: string | null,
    filters: ReportFilters
) {
    return useQuery({
        queryKey: workspaceId
            ? reportQueryKeys.budgetSummary(workspaceId, filters)
            : reportQueryKeys.analytics(),
        queryFn: async (): Promise<BudgetSummaryReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getBudgetSummary(workspaceId, filters);

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}