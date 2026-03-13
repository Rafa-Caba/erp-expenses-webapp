// src/features/workspaces/api/workspace-member.queryKeys.ts

export const workspaceMemberQueryKeys = {
    all: ["workspace-members"] as const,

    lists: () => ["workspace-members", "list"] as const,

    list: (workspaceId: string) => ["workspace-members", "list", workspaceId] as const,

    details: () => ["workspace-members", "detail"] as const,

    detail: (workspaceId: string, memberId: string) =>
        ["workspace-members", "detail", workspaceId, memberId] as const,
};