// src/features/reports/hooks/useReportByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reportQueryKeys } from "../api/report.queryKeys";
import { createReportService } from "../services/report.service";
import type { ReportRecord } from "../types/report.types";

const reportService = createReportService(apiClient);

export function useReportByIdQuery(
    workspaceId: string | null,
    reportId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && reportId
                ? reportQueryKeys.detail(workspaceId, reportId)
                : reportQueryKeys.details(),
        queryFn: async (): Promise<ReportRecord> => {
            if (!workspaceId || !reportId) {
                throw new Error("Workspace ID and report ID are required");
            }

            const response = await reportService.getReportById(workspaceId, reportId);

            return response.report;
        },
        enabled: workspaceId !== null && reportId !== null,
        staleTime: 30_000,
    });
}