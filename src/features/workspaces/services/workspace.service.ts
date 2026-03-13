// src/workspaces/services/workspace.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateWorkspacePayload,
    GetWorkspacesQuery,
    UpdateWorkspacePayload,
    WorkspaceResponse,
    WorkspacesResponse,
} from "../types/workspace.types";

export function createWorkspaceService(apiClient: AxiosInstance) {
    return {
        getWorkspaces(query?: GetWorkspacesQuery): Promise<WorkspacesResponse> {
            return apiClient
                .get<WorkspacesResponse>("/api/workspaces", {
                    params: query,
                })
                .then(({ data }) => data);
        },

        getWorkspaceById(workspaceId: string): Promise<WorkspaceResponse> {
            return apiClient
                .get<WorkspaceResponse>(`/api/workspaces/${workspaceId}`)
                .then(({ data }) => data);
        },

        createWorkspace(payload: CreateWorkspacePayload): Promise<WorkspaceResponse> {
            return apiClient
                .post<WorkspaceResponse>("/api/workspaces", payload)
                .then(({ data }) => data);
        },

        updateWorkspace(
            workspaceId: string,
            payload: UpdateWorkspacePayload
        ): Promise<WorkspaceResponse> {
            return apiClient
                .patch<WorkspaceResponse>(`/api/workspaces/${workspaceId}`, payload)
                .then(({ data }) => data);
        },

        archiveWorkspace(workspaceId: string): Promise<WorkspaceResponse> {
            return apiClient
                .delete<WorkspaceResponse>(`/api/workspaces/${workspaceId}`)
                .then(({ data }) => data);
        },
    };
}