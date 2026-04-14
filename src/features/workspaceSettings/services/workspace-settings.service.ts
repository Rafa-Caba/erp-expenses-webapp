// src/features/workspaceSettings/services/workspace-settings.service.ts

import type { AxiosInstance } from "axios";

import type {
    UpdateWorkspaceSettingsPayload,
    WorkspaceSettingsResponse,
} from "../types/workspace-settings.types";

export function createWorkspaceSettingsService(apiClient: AxiosInstance) {
    return {
        getWorkspaceSettings(workspaceId: string): Promise<WorkspaceSettingsResponse> {
            return apiClient
                .get<WorkspaceSettingsResponse>(`/api/workspaces/${workspaceId}/settings`)
                .then(({ data }) => data);
        },

        updateWorkspaceSettings(
            workspaceId: string,
            payload: UpdateWorkspaceSettingsPayload
        ): Promise<WorkspaceSettingsResponse> {
            return apiClient
                .patch<WorkspaceSettingsResponse>(
                    `/api/workspaces/${workspaceId}/settings`,
                    payload
                )
                .then(({ data }) => data);
        },
    };
}