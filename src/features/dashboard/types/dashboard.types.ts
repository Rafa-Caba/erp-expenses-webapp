// src/features/dashboard/types/dashboard.types.ts

import type { CurrencyCode } from "../../../shared/types/common.types";
import type { ReminderRecord } from "../../reminders/types/reminder.types";
import type { ReconciliationListFilters, ReconciliationSummary } from "../../reconciliation/types/reconciliation.types";
import type {
    BudgetSummaryReport,
    CategoryBreakdownReport,
    DebtSummaryReport,
    MonthlySummaryReport,
    ReportFilters,
    ReportGroupBy,
} from "../../reports/types/report.types";

export type DashboardRangePreset =
    | "7d"
    | "30d"
    | "month"
    | "quarter"
    | "year"
    | "custom";

export type DashboardGroupBy = "auto" | Extract<ReportGroupBy, "day" | "week" | "month">;

export interface DashboardFilters {
    rangePreset: DashboardRangePreset;
    currency: CurrencyCode | "ALL";
    groupBy: DashboardGroupBy;
    memberId: string;
    categoryId: string;
    accountId: string;
    cardId: string;
    includeArchived: boolean;
    customDateFrom: string;
    customDateTo: string;
}

export interface DashboardResolvedDateRange {
    dateFrom: string;
    dateTo: string;
    periodLabel: string;
    resolvedGroupBy: Extract<ReportGroupBy, "day" | "week" | "month">;
}

export interface DashboardHighlight {
    id: string;
    title: string;
    description: string;
    severity: "success" | "info" | "warning";
}

export interface DashboardRemindersSummary {
    scopedTotalCount: number;
    pendingCount: number;
    doneCount: number;
    dismissedCount: number;
    overdueCount: number;
    nextReminders: ReminderRecord[];
}

export interface DashboardOverviewData {
    monthlySummary: MonthlySummaryReport;
    categoryBreakdown: CategoryBreakdownReport;
    debtSummary: DebtSummaryReport;
    budgetSummary: BudgetSummaryReport;
    reconciliationSummary: ReconciliationSummary;
    remindersSummary: DashboardRemindersSummary;
}

export interface DashboardOverviewQueryState {
    reportFilters: ReportFilters;
    reconciliationFilters: ReconciliationListFilters;
    dateRange: DashboardResolvedDateRange;
}