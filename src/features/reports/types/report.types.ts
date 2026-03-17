// src/features/reports/types/report.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export type ReportType =
    | "monthly_summary"
    | "category_breakdown"
    | "debt_report"
    | "budget_report"
    | "custom";

export type ReportStatus = "pending" | "generated" | "failed" | "archived";
export type ReportGroupBy = "day" | "week" | "month" | "category" | "member";
export type ReportExportFormat = "csv" | "xlsx";
export type ReportFileResourceType = "image" | "video" | "raw" | "auto";

export interface ReportFilters {
    dateFrom?: Nullable<string>;
    dateTo?: Nullable<string>;
    currency?: Nullable<CurrencyCode>;
    memberId?: Nullable<string>;
    categoryId?: Nullable<string>;
    accountId?: Nullable<string>;
    cardId?: Nullable<string>;
    includeArchived?: Nullable<boolean>;
    groupBy?: Nullable<ReportGroupBy>;
}

export interface ReportRecord {
    _id: string;
    workspaceId: string;
    name: string;
    type: ReportType;
    filters: Nullable<ReportFilters>;
    generatedByMemberId: Nullable<string>;
    fileUrl: Nullable<string>;
    filePublicId: Nullable<string>;
    fileResourceType: Nullable<ReportFileResourceType>;
    fileName: Nullable<string>;
    fileFormat: Nullable<string>;
    notes: Nullable<string>;
    status: ReportStatus;
    isVisible: boolean;
    generatedAt: Nullable<IsoDateString>;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface CreateReportPayload {
    name: string;
    type: ReportType;
    filters?: Nullable<ReportFilters>;
    generatedByMemberId?: Nullable<string>;
    fileUrl?: Nullable<string>;
    filePublicId?: Nullable<string>;
    fileResourceType?: Nullable<ReportFileResourceType>;
    fileName?: Nullable<string>;
    fileFormat?: Nullable<string>;
    notes?: Nullable<string>;
    status?: ReportStatus;
    isVisible?: boolean;
    generatedAt?: Nullable<string>;
}

export interface UpdateReportPayload {
    name?: string;
    type?: ReportType;
    filters?: Nullable<ReportFilters>;
    generatedByMemberId?: Nullable<string>;
    fileUrl?: Nullable<string>;
    filePublicId?: Nullable<string>;
    fileResourceType?: Nullable<ReportFileResourceType>;
    fileName?: Nullable<string>;
    fileFormat?: Nullable<string>;
    notes?: Nullable<string>;
    status?: ReportStatus;
    isVisible?: boolean;
    generatedAt?: Nullable<string>;
}

export interface ExportReportPayload {
    name: string;
    notes?: Nullable<string>;
    filters?: Nullable<ReportFilters>;
    exportFormat: ReportExportFormat;
    generatedByMemberId?: Nullable<string>;
    persistReport?: boolean;
}

export interface ExportReportFile {
    format: ReportExportFormat;
    fileName: string;
    fileUrl: Nullable<string>;
    filePublicId: string;
    fileResourceType: ReportFileResourceType;
    fileFormat: Nullable<string>;
    fileBytes: number;
}

export interface ExportReportResponse {
    message: string;
    report: Nullable<ReportRecord>;
    file: ExportReportFile;
}

export interface MonthlySummaryTotals {
    income: number;
    expenses: number;
    debtPayments: number;
    transfers: number;
    adjustments: number;
    netBalance: number;
}

export interface MonthlySummaryCounts {
    income: number;
    expenses: number;
    debtPayments: number;
    transfers: number;
    adjustments: number;
    total: number;
}

export interface MonthlySummaryCategoryItem {
    categoryId: Nullable<string>;
    categoryName: string;
    totalAmount: number;
    transactionCount: number;
}

export interface MonthlySummarySeriesItem {
    label: string;
    income: number;
    expenses: number;
    debtPayments: number;
    transfers: number;
    adjustments: number;
    netBalance: number;
    transactionCount: number;
}

export interface MonthlySummaryReport {
    filters: ReportFilters;
    totals: MonthlySummaryTotals;
    counts: MonthlySummaryCounts;
    topExpenseCategories: MonthlySummaryCategoryItem[];
    series: MonthlySummarySeriesItem[];
}

export interface CategoryBreakdownItem {
    categoryId: Nullable<string>;
    categoryName: string;
    totalAmount: number;
    transactionCount: number;
    percentageOfTotal: number;
}

export interface CategoryBreakdownSeriesItem {
    label: string;
    totalAmount: number;
    transactionCount: number;
}

export interface CategoryBreakdownReport {
    filters: ReportFilters;
    totalAmount: number;
    totalTransactions: number;
    categories: CategoryBreakdownItem[];
    series: CategoryBreakdownSeriesItem[];
}

export interface DebtSummaryCounts {
    total: number;
    active: number;
    paid: number;
    overdue: number;
    cancelled: number;
}

export interface DebtSummaryDirection {
    owedByMeCount: number;
    owedToMeCount: number;
    owedByMeOriginalAmount: number;
    owedToMeOriginalAmount: number;
    owedByMeRemainingAmount: number;
    owedToMeRemainingAmount: number;
}

export interface DebtSummarySeriesItem {
    label: string;
    createdDebtAmount: number;
    paidAmount: number;
    remainingAmount: number;
}

export interface DebtSummaryReport {
    filters: ReportFilters;
    counts: DebtSummaryCounts;
    direction: DebtSummaryDirection;
    totalOriginalAmount: number;
    totalRemainingAmount: number;
    completedPaymentsTotal: number;
    series: DebtSummarySeriesItem[];
}

export type BudgetComputedStatus =
    | "draft"
    | "active"
    | "completed"
    | "exceeded"
    | "archived";

export interface BudgetSummaryItem {
    budgetId: string;
    name: string;
    currency: CurrencyCode;
    limitAmount: number;
    spentAmount: number;
    remainingAmount: number;
    usagePercent: number;
    hasReachedAlert: boolean;
    isExceeded: boolean;
    matchedTransactionCount: number;
    computedStatus: BudgetComputedStatus;
    startDate: IsoDateString;
    endDate: IsoDateString;
    categoryId: Nullable<string>;
    memberId: Nullable<string>;
}

export interface BudgetSummarySeriesItem {
    label: string;
    totalLimitAmount: number;
    totalSpentAmount: number;
    totalRemainingAmount: number;
}

export interface BudgetSummaryTotals {
    budgetCount: number;
    totalLimitAmount: number;
    totalSpentAmount: number;
    totalRemainingAmount: number;
    exceededCount: number;
    alertReachedCount: number;
}

export interface BudgetSummaryReport {
    filters: ReportFilters;
    totals: BudgetSummaryTotals;
    budgets: BudgetSummaryItem[];
    series: BudgetSummarySeriesItem[];
}

export type ReportsResponse = CollectionResponse<"reports", ReportRecord>;
export type ReportResponse = EntityResponse<"report", ReportRecord>;
export type MonthlySummaryResponse = EntityResponse<"summary", MonthlySummaryReport>;
export type CategoryBreakdownResponse = EntityResponse<"breakdown", CategoryBreakdownReport>;
export type DebtSummaryResponse = EntityResponse<"summary", DebtSummaryReport>;
export type BudgetSummaryResponse = EntityResponse<"summary", BudgetSummaryReport>;