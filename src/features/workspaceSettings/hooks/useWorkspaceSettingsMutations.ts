// src/features/workspaceSettings/hooks/useWorkspaceSettingsMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceSettingsQueryKeys } from "../api/workspace-settings.queryKeys";
import { createWorkspaceSettingsService } from "../services/workspace-settings.service";
import type {
    UpdateWorkspaceSettingsPayload,
    WorkspaceSettingsResponse,
} from "../types/workspace-settings.types";

const workspaceSettingsService = createWorkspaceSettingsService(apiClient);

type UpdateWorkspaceSettingsMutationPayload = {
    workspaceId: string;
    payload: UpdateWorkspaceSettingsPayload;
};

export function useUpdateWorkspaceSettingsMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        WorkspaceSettingsResponse,
        Error,
        UpdateWorkspaceSettingsMutationPayload
    >({
        mutationFn: ({ workspaceId, payload }) =>
            workspaceSettingsService.updateWorkspaceSettings(workspaceId, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: workspaceSettingsQueryKeys.all,
            });

            queryClient.setQueryData(
                workspaceSettingsQueryKeys.detail(response.settings.workspaceId),
                response
            );
        },
    });
}