// src/features/workspaces/hooks/useWorkspaceMemberMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceMemberQueryKeys } from "../api/workspace-member.queryKeys";
import type {
    CreateWorkspaceMemberPayload,
    UpdateWorkspaceMemberPayload,
    UpdateWorkspaceMemberStatusPayload,
    WorkspaceMemberResponse,
} from "../types/workspace-member.types";
import { createWorkspaceMemberService } from "../services/workspace-member.service";

const workspaceMemberService = createWorkspaceMemberService(apiClient);

type CreateWorkspaceMemberMutationPayload = {
    workspaceId: string;
    payload: CreateWorkspaceMemberPayload;
};

type UpdateWorkspaceMemberMutationPayload = {
    workspaceId: string;
    memberId: string;
    payload: UpdateWorkspaceMemberPayload;
};

type UpdateWorkspaceMemberStatusMutationPayload = {
    workspaceId: string;
    memberId: string;
    payload: UpdateWorkspaceMemberStatusPayload;
};

type DeleteWorkspaceMemberMutationPayload = {
    workspaceId: string;
    memberId: string;
};

export function useCreateWorkspaceMemberMutation() {
    const queryClient = useQueryClient();

    return useMutation<WorkspaceMemberResponse, Error, CreateWorkspaceMemberMutationPayload>({
        mutationFn: ({ workspaceId, payload }) =>
            workspaceMemberService.createMember(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceMemberQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceMemberQueryKeys.detail(
                    response.member.workspaceId,
                    response.member.id
                ),
                response.member
            );
        },
    });
}

export function useUpdateWorkspaceMemberMutation() {
    const queryClient = useQueryClient();

    return useMutation<WorkspaceMemberResponse, Error, UpdateWorkspaceMemberMutationPayload>({
        mutationFn: ({ workspaceId, memberId, payload }) =>
            workspaceMemberService.updateMember(workspaceId, memberId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceMemberQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceMemberQueryKeys.detail(
                    response.member.workspaceId,
                    response.member.id
                ),
                response.member
            );
        },
    });
}

export function useUpdateWorkspaceMemberStatusMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        WorkspaceMemberResponse,
        Error,
        UpdateWorkspaceMemberStatusMutationPayload
    >({
        mutationFn: ({ workspaceId, memberId, payload }) =>
            workspaceMemberService.updateMemberStatus(workspaceId, memberId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceMemberQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceMemberQueryKeys.detail(
                    response.member.workspaceId,
                    response.member.id
                ),
                response.member
            );
        },
    });
}

export function useDeleteWorkspaceMemberMutation() {
    const queryClient = useQueryClient();

    return useMutation<WorkspaceMemberResponse, Error, DeleteWorkspaceMemberMutationPayload>({
        mutationFn: ({ workspaceId, memberId }) =>
            workspaceMemberService.deleteMember(workspaceId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: workspaceMemberQueryKeys.all,
            });
        },
    });
}