// src/features/workspaces/hooks/useWorkspaceMembersQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceMemberQueryKeys } from "../api/workspace-member.queryKeys";
import { createWorkspaceMemberService } from "../services/workspace-member.service";

const workspaceMemberService = createWorkspaceMemberService(apiClient);

export function useWorkspaceMembersQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId
            ? workspaceMemberQueryKeys.list(workspaceId)
            : workspaceMemberQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return workspaceMemberService.getMembers(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}