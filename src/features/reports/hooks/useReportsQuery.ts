// src/features/reports/hooks/useReportsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { reportQueryKeys } from "../api/report.queryKeys";
import { createReportService } from "../services/report.service";

const reportService = createReportService(apiClient);

export function useReportsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? reportQueryKeys.list(workspaceId) : reportQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return reportService.getReports(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}