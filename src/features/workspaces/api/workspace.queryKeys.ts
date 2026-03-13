// src/features/workspaces/api/workspace.queryKeys.ts

import type { GetWorkspacesQuery } from "../types/workspace.types";

export const workspaceQueryKeys = {
    all: ["workspaces"] as const,

    lists: () => ["workspaces", "list"] as const,

    list: (query?: GetWorkspacesQuery) =>
        [
            "workspaces",
            "list",
            query?.includeArchived ?? false,
            query?.includeInactive ?? false,
        ] as const,

    details: () => ["workspaces", "detail"] as const,

    detail: (workspaceId: string) => ["workspaces", "detail", workspaceId] as const,
};