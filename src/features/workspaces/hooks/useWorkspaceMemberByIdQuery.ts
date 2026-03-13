// src/features/workspaces/hooks/useWorkspaceMemberByIdQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceMemberQueryKeys } from "../api/workspace-member.queryKeys";
import type { WorkspaceMemberRecord } from "../types/workspace-member.types";
import { createWorkspaceMemberService } from "../services/workspace-member.service";

const workspaceMemberService = createWorkspaceMemberService(apiClient);

export function useWorkspaceMemberByIdQuery(
    workspaceId: string | null,
    memberId: string | null
) {
    return useQuery({
        queryKey:
            workspaceId && memberId
                ? workspaceMemberQueryKeys.detail(workspaceId, memberId)
                : workspaceMemberQueryKeys.details(),
        queryFn: async (): Promise<WorkspaceMemberRecord> => {
            if (!workspaceId || !memberId) {
                throw new Error("Workspace ID and member ID are required");
            }

            const response = await workspaceMemberService.getMembers(workspaceId);

            const member =
                response.members.find(
                    (workspaceMember: WorkspaceMemberRecord) =>
                        workspaceMember.id === memberId
                ) ?? null;

            if (!member) {
                throw new Error("Workspace member not found");
            }

            return member;
        },
        enabled: workspaceId !== null && memberId !== null,
        staleTime: 30_000,
    });
}