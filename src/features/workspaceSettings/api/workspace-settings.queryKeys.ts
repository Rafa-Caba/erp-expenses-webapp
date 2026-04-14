// src/features/workspaceSettings/api/workspace-settings.queryKeys.ts

export const workspaceSettingsQueryKeys = {
    all: ["workspaceSettings"] as const,

    details: () => ["workspaceSettings", "detail"] as const,

    detail: (workspaceId: string) =>
        ["workspaceSettings", "detail", workspaceId] as const,
};