// src/features/workspaces/hooks/useMyWorkspacesQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceQueryKeys } from "../api/workspace.queryKeys";
import type { GetWorkspacesQuery } from "../types/workspace.types";
import { createWorkspaceService } from "../services/workspace.service";

const workspaceService = createWorkspaceService(apiClient);

export function useMyWorkspacesQuery(query?: GetWorkspacesQuery) {
    return useQuery({
        queryKey: workspaceQueryKeys.list(query),
        queryFn: () => workspaceService.getWorkspaces(query),
        staleTime: 30_000,
    });
}