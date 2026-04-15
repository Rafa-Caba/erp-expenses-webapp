// src/features/dashboard/hooks/useDashboardOverview.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { dashboardQueryKeys } from "../api/dashboard.queryKeys";
import {
    buildDashboardReconciliationFilters,
    buildDashboardRemindersSummary,
    buildDashboardReportFilters,
    resolveDashboardDateRange,
} from "../services/dashboard.service";
import type { DashboardFilters, DashboardOverviewQueryState, DashboardRemindersSummary } from "../types/dashboard.types";
import { createReconciliationService } from "../../reconciliation/services/reconciliation.service";
import { createReminderService } from "../../reminders/services/reminder.service";
import { createReportService } from "../../reports/services/report.service";
import type {
    BudgetSummaryReport,
    CategoryBreakdownReport,
    DebtSummaryReport,
    MonthlySummaryReport,
} from "../../reports/types/report.types";
import type { ReconciliationSummary } from "../../reconciliation/types/reconciliation.types";

const reportService = createReportService(apiClient);
const reconciliationService = createReconciliationService(apiClient);
const reminderService = createReminderService(apiClient);

function buildFiltersKey(filters: DashboardFilters): string {
    return JSON.stringify(filters);
}

export function useDashboardOverview(
    workspaceId: string | null,
    filters: DashboardFilters
) {
    const filtersKey = useMemo(() => buildFiltersKey(filters), [filters]);

    const dateRange = useMemo(() => resolveDashboardDateRange(filters), [filters]);
    const reportFilters = useMemo(() => buildDashboardReportFilters(filters), [filters]);
    const reconciliationFilters = useMemo(
        () => buildDashboardReconciliationFilters(filters),
        [filters]
    );

    const monthlySummaryQuery = useQuery({
        queryKey: workspaceId
            ? dashboardQueryKeys.monthlySummary(workspaceId, filtersKey)
            : dashboardQueryKeys.all,
        queryFn: async (): Promise<MonthlySummaryReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getMonthlySummary(workspaceId, reportFilters);

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });

    const categoryBreakdownQuery = useQuery({
        queryKey: workspaceId
            ? dashboardQueryKeys.categoryBreakdown(workspaceId, filtersKey)
            : dashboardQueryKeys.all,
        queryFn: async (): Promise<CategoryBreakdownReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getCategoryBreakdown(
                workspaceId,
                reportFilters
            );

            return response.breakdown;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });

    const debtSummaryQuery = useQuery({
        queryKey: workspaceId
            ? dashboardQueryKeys.debtSummary(workspaceId, filtersKey)
            : dashboardQueryKeys.all,
        queryFn: async (): Promise<DebtSummaryReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getDebtSummary(workspaceId, reportFilters);

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });

    const budgetSummaryQuery = useQuery({
        queryKey: workspaceId
            ? dashboardQueryKeys.budgetSummary(workspaceId, filtersKey)
            : dashboardQueryKeys.all,
        queryFn: async (): Promise<BudgetSummaryReport> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reportService.getBudgetSummary(workspaceId, reportFilters);

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });

    const reconciliationSummaryQuery = useQuery({
        queryKey: workspaceId
            ? dashboardQueryKeys.reconciliationSummary(workspaceId, filtersKey)
            : dashboardQueryKeys.all,
        queryFn: async (): Promise<ReconciliationSummary> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reconciliationService.getReconciliationSummary(
                workspaceId,
                reconciliationFilters
            );

            return response.summary;
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });

    const remindersSummaryQuery = useQuery({
        queryKey: workspaceId
            ? ["dashboard", "reminders-summary", workspaceId, filtersKey]
            : dashboardQueryKeys.all,
        queryFn: async (): Promise<DashboardRemindersSummary> => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            const response = await reminderService.getReminders(workspaceId);

            return buildDashboardRemindersSummary(response.reminders, filters);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
        refetchInterval: 60_000,
    });

    const queryState: DashboardOverviewQueryState = {
        reportFilters,
        reconciliationFilters,
        dateRange,
    };

    return {
        queryState,
        monthlySummaryQuery,
        categoryBreakdownQuery,
        debtSummaryQuery,
        budgetSummaryQuery,
        reconciliationSummaryQuery,
        remindersSummaryQuery,
    };
}