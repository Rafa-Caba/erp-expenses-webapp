// src/features/reports/hooks/useReportExportMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reportQueryKeys } from "../api/report.queryKeys";
import { createReportService } from "../services/report.service";
import type {
    ExportReportPayload,
    ExportReportResponse,
} from "../types/report.types";

const reportService = createReportService(apiClient);

type ExportReportMutationPayload = {
    workspaceId: string;
    payload: ExportReportPayload;
};

export function useExportMonthlySummaryMutation() {
    const queryClient = useQueryClient();

    return useMutation<ExportReportResponse, Error, ExportReportMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            reportService.exportMonthlySummary(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });
        },
    });
}

export function useExportCategoryBreakdownMutation() {
    const queryClient = useQueryClient();

    return useMutation<ExportReportResponse, Error, ExportReportMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            reportService.exportCategoryBreakdown(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });
        },
    });
}

export function useExportDebtSummaryMutation() {
    const queryClient = useQueryClient();

    return useMutation<ExportReportResponse, Error, ExportReportMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            reportService.exportDebtSummary(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });
        },
    });
}

export function useExportBudgetSummaryMutation() {
    const queryClient = useQueryClient();

    return useMutation<ExportReportResponse, Error, ExportReportMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            reportService.exportBudgetSummary(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });
        },
    });
}