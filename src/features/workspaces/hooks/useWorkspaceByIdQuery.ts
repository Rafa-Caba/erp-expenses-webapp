// src/features/workspaces/hooks/useWorkspaceByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceQueryKeys } from "../api/workspace.queryKeys";
import { createWorkspaceService } from "../services/workspace.service";

const workspaceService = createWorkspaceService(apiClient);

export function useWorkspaceByIdQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceQueryKeys.detail(workspaceId ?? "missing"),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return workspaceService.getWorkspaceById(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}