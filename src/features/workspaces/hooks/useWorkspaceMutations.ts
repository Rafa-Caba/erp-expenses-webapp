// src/features/workspaces/hooks/useWorkspaceMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceQueryKeys } from "../api/workspace.queryKeys";
import type {
    CreateWorkspacePayload,
    UpdateWorkspacePayload,
} from "../types/workspace.types";
import { createWorkspaceService } from "../services/workspace.service";

const workspaceService = createWorkspaceService(apiClient);

export function useCreateWorkspaceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateWorkspacePayload) =>
            workspaceService.createWorkspace(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceQueryKeys.detail(response.workspace.id),
                response
            );
        },
    });
}

type UpdateWorkspaceMutationPayload = {
    workspaceId: string;
    payload: UpdateWorkspacePayload;
};

export function useUpdateWorkspaceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workspaceId, payload }: UpdateWorkspaceMutationPayload) =>
            workspaceService.updateWorkspace(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceQueryKeys.detail(response.workspace.id),
                response
            );
        },
    });
}

export function useArchiveWorkspaceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workspaceId: string) => workspaceService.archiveWorkspace(workspaceId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceQueryKeys.detail(response.workspace.id),
                response
            );
        },
    });
}