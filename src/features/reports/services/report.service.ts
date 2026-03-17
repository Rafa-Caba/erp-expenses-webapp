// src/features/reports/services/report.service.ts

import type { AxiosInstance } from "axios";

import type {
    BudgetSummaryResponse,
    CategoryBreakdownResponse,
    CreateReportPayload,
    DebtSummaryResponse,
    ExportReportPayload,
    ExportReportResponse,
    MonthlySummaryResponse,
    ReportFilters,
    ReportResponse,
    ReportsResponse,
    UpdateReportPayload,
} from "../types/report.types";

export function createReportService(apiClient: AxiosInstance) {
    return {
        getReports(workspaceId: string): Promise<ReportsResponse> {
            return apiClient
                .get<ReportsResponse>(`/api/workspaces/${workspaceId}/reports`)
                .then(({ data }) => data);
        },

        getReportById(workspaceId: string, reportId: string): Promise<ReportResponse> {
            return apiClient
                .get<ReportResponse>(`/api/workspaces/${workspaceId}/reports/${reportId}`)
                .then(({ data }) => data);
        },

        createReport(workspaceId: string, payload: CreateReportPayload): Promise<ReportResponse> {
            return apiClient
                .post<ReportResponse>(`/api/workspaces/${workspaceId}/reports`, payload)
                .then(({ data }) => data);
        },

        updateReport(
            workspaceId: string,
            reportId: string,
            payload: UpdateReportPayload
        ): Promise<ReportResponse> {
            return apiClient
                .patch<ReportResponse>(
                    `/api/workspaces/${workspaceId}/reports/${reportId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteReport(workspaceId: string, reportId: string): Promise<ReportResponse> {
            return apiClient
                .delete<ReportResponse>(`/api/workspaces/${workspaceId}/reports/${reportId}`)
                .then(({ data }) => data);
        },

        getMonthlySummary(
            workspaceId: string,
            query?: ReportFilters
        ): Promise<MonthlySummaryResponse> {
            return apiClient
                .get<MonthlySummaryResponse>(
                    `/api/workspaces/${workspaceId}/reports/analytics/monthly-summary`,
                    { params: query }
                )
                .then(({ data }) => data);
        },

        getCategoryBreakdown(
            workspaceId: string,
            query?: ReportFilters
        ): Promise<CategoryBreakdownResponse> {
            return apiClient
                .get<CategoryBreakdownResponse>(
                    `/api/workspaces/${workspaceId}/reports/analytics/category-breakdown`,
                    { params: query }
                )
                .then(({ data }) => data);
        },

        getDebtSummary(
            workspaceId: string,
            query?: ReportFilters
        ): Promise<DebtSummaryResponse> {
            return apiClient
                .get<DebtSummaryResponse>(
                    `/api/workspaces/${workspaceId}/reports/analytics/debt-summary`,
                    { params: query }
                )
                .then(({ data }) => data);
        },

        getBudgetSummary(
            workspaceId: string,
            query?: ReportFilters
        ): Promise<BudgetSummaryResponse> {
            return apiClient
                .get<BudgetSummaryResponse>(
                    `/api/workspaces/${workspaceId}/reports/analytics/budget-summary`,
                    { params: query }
                )
                .then(({ data }) => data);
        },

        exportMonthlySummary(
            workspaceId: string,
            payload: ExportReportPayload
        ): Promise<ExportReportResponse> {
            return apiClient
                .post<ExportReportResponse>(
                    `/api/workspaces/${workspaceId}/reports/exports/monthly-summary`,
                    payload
                )
                .then(({ data }) => data);
        },

        exportCategoryBreakdown(
            workspaceId: string,
            payload: ExportReportPayload
        ): Promise<ExportReportResponse> {
            return apiClient
                .post<ExportReportResponse>(
                    `/api/workspaces/${workspaceId}/reports/exports/category-breakdown`,
                    payload
                )
                .then(({ data }) => data);
        },

        exportDebtSummary(
            workspaceId: string,
            payload: ExportReportPayload
        ): Promise<ExportReportResponse> {
            return apiClient
                .post<ExportReportResponse>(
                    `/api/workspaces/${workspaceId}/reports/exports/debt-summary`,
                    payload
                )
                .then(({ data }) => data);
        },

        exportBudgetSummary(
            workspaceId: string,
            payload: ExportReportPayload
        ): Promise<ExportReportResponse> {
            return apiClient
                .post<ExportReportResponse>(
                    `/api/workspaces/${workspaceId}/reports/exports/budget-summary`,
                    payload
                )
                .then(({ data }) => data);
        },
    };
}