// src/features/themes/api/theme.queryKeys.ts

import type { ThemeKey } from "../types/theme.types";

export const themeQueryKeys = {
    all: ["themes"] as const,
    lists: () => ["themes", "list"] as const,
    list: (workspaceId: string) => ["themes", "list", workspaceId] as const,
    details: () => ["themes", "detail"] as const,
    detail: (workspaceId: string, themeKey: ThemeKey) =>
        ["themes", "detail", workspaceId, themeKey] as const,
};