// src/features/workspaces/services/workspace-member.service.ts

import type { AxiosInstance } from "axios";

import type {
    CreateWorkspaceMemberPayload,
    UpdateWorkspaceMemberPayload,
    UpdateWorkspaceMemberStatusPayload,
    WorkspaceMemberResponse,
    WorkspaceMembersResponse,
} from "../types/workspace-member.types";

export function createWorkspaceMemberService(apiClient: AxiosInstance) {
    return {
        getMembers(workspaceId: string): Promise<WorkspaceMembersResponse> {
            return apiClient
                .get<WorkspaceMembersResponse>(`/api/workspaces/${workspaceId}/members`)
                .then(({ data }) => data);
        },

        createMember(
            workspaceId: string,
            payload: CreateWorkspaceMemberPayload
        ): Promise<WorkspaceMemberResponse> {
            return apiClient
                .post<WorkspaceMemberResponse>(
                    `/api/workspaces/${workspaceId}/members`,
                    payload
                )
                .then(({ data }) => data);
        },

        updateMember(
            workspaceId: string,
            memberId: string,
            payload: UpdateWorkspaceMemberPayload
        ): Promise<WorkspaceMemberResponse> {
            return apiClient
                .patch<WorkspaceMemberResponse>(
                    `/api/workspaces/${workspaceId}/members/${memberId}`,
                    payload
                )
                .then(({ data }) => data);
        },

        updateMemberStatus(
            workspaceId: string,
            memberId: string,
            payload: UpdateWorkspaceMemberStatusPayload
        ): Promise<WorkspaceMemberResponse> {
            return apiClient
                .patch<WorkspaceMemberResponse>(
                    `/api/workspaces/${workspaceId}/members/${memberId}/status`,
                    payload
                )
                .then(({ data }) => data);
        },

        deleteMember(workspaceId: string, memberId: string): Promise<WorkspaceMemberResponse> {
            return apiClient
                .delete<WorkspaceMemberResponse>(
                    `/api/workspaces/${workspaceId}/members/${memberId}`
                )
                .then(({ data }) => data);
        },
    };
}