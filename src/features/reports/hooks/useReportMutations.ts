// src/features/reports/hooks/useReportMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reportQueryKeys } from "../api/report.queryKeys";
import { createReportService } from "../services/report.service";
import type {
    CreateReportPayload,
    ReportResponse,
    UpdateReportPayload,
} from "../types/report.types";

const reportService = createReportService(apiClient);

type CreateReportMutationPayload = {
    workspaceId: string;
    payload: CreateReportPayload;
};

type UpdateReportMutationPayload = {
    workspaceId: string;
    reportId: string;
    payload: UpdateReportPayload;
};

type DeleteReportMutationPayload = {
    workspaceId: string;
    reportId: string;
};

export function useCreateReportMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReportResponse, Error, CreateReportMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            reportService.createReport(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });

            queryClient.setQueryData(
                reportQueryKeys.detail(response.report.workspaceId, response.report._id),
                response.report
            );
        },
    });
}

export function useUpdateReportMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReportResponse, Error, UpdateReportMutationPayload>({
        mutationFn: ({ workspaceId, reportId, payload }) =>
            reportService.updateReport(workspaceId, reportId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });

            queryClient.setQueryData(
                reportQueryKeys.detail(response.report.workspaceId, response.report._id),
                response.report
            );
        },
    });
}

export function useDeleteReportMutation() {
    const queryClient = useQueryClient();

    return useMutation<ReportResponse, Error, DeleteReportMutationPayload>({
        mutationFn: ({ workspaceId, reportId }) =>
            reportService.deleteReport(workspaceId, reportId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: reportQueryKeys.all,
            });

            queryClient.setQueryData(
                reportQueryKeys.detail(response.report.workspaceId, response.report._id),
                response.report
            );
        },
    });
}