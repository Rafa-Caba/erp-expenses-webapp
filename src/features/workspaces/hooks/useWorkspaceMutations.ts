// src/features/workspaces/hooks/useWorkspaceMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceQueryKeys } from "../api/workspace.queryKeys";
import type {
    CreateWorkspacePayload,
    UpdateWorkspacePayload,
    WorkspaceListItem,
    WorkspaceRecord,
    WorkspaceResponse,
    WorkspacesResponse,
} from "../types/workspace.types";
import { createWorkspaceService } from "../services/workspace.service";

const workspaceService = createWorkspaceService(apiClient);

function toWorkspaceListItem(
    workspace: WorkspaceRecord,
    previousItem?: WorkspaceListItem
): WorkspaceListItem {
    return {
        ...workspace,
        memberCount: previousItem?.memberCount,
    };
}

function syncWorkspaceIntoLists(
    response: WorkspaceResponse,
    currentData: WorkspacesResponse | undefined
): WorkspacesResponse | undefined {
    if (!currentData) {
        return currentData;
    }

    const updatedWorkspace = response.workspace;
    const existingItem = currentData.workspaces.find(
        (workspace) => workspace.id === updatedWorkspace.id
    );

    const nextItem = toWorkspaceListItem(updatedWorkspace, existingItem);
    const alreadyExists = existingItem !== undefined;

    return {
        ...currentData,
        workspaces: alreadyExists
            ? currentData.workspaces.map((workspace) =>
                workspace.id === updatedWorkspace.id ? nextItem : workspace
            )
            : [nextItem, ...currentData.workspaces],
    };
}

function syncWorkspaceDetail(
    response: WorkspaceResponse,
    currentData: WorkspaceResponse | undefined
): WorkspaceResponse {
    return {
        ...currentData,
        ...response,
        workspace: {
            ...(currentData?.workspace ?? response.workspace),
            ...response.workspace,
        },
    };
}

export function useCreateWorkspaceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateWorkspacePayload) =>
            workspaceService.createWorkspace(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceQueryKeys.all,
            });

            queryClient.setQueriesData<WorkspacesResponse>(
                { queryKey: workspaceQueryKeys.lists() },
                (currentData) => syncWorkspaceIntoLists(response, currentData)
            );

            queryClient.setQueryData<WorkspaceResponse>(
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

            queryClient.setQueriesData<WorkspacesResponse>(
                { queryKey: workspaceQueryKeys.lists() },
                (currentData) => syncWorkspaceIntoLists(response, currentData)
            );

            queryClient.setQueryData<WorkspaceResponse>(
                workspaceQueryKeys.detail(response.workspace.id),
                (currentData: WorkspaceResponse | undefined) =>
                    syncWorkspaceDetail(response, currentData)
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

            queryClient.setQueriesData<WorkspacesResponse>(
                { queryKey: workspaceQueryKeys.lists() },
                (currentData) => syncWorkspaceIntoLists(response, currentData)
            );

            queryClient.setQueryData<WorkspaceResponse>(
                workspaceQueryKeys.detail(response.workspace.id),
                (currentData: WorkspaceResponse | undefined) =>
                    syncWorkspaceDetail(response, currentData)
            );
        },
    });
}