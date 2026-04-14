// src/features/workspaceSettings/hooks/useWorkspaceSettingsQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceSettingsQueryKeys } from "../api/workspace-settings.queryKeys";
import { createWorkspaceSettingsService } from "../services/workspace-settings.service";

const workspaceSettingsService = createWorkspaceSettingsService(apiClient);

export function useWorkspaceSettingsQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? workspaceSettingsQueryKeys.detail(workspaceId)
            : workspaceSettingsQueryKeys.details(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return workspaceSettingsService.getWorkspaceSettings(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}