// src/features/themes/hooks/useThemesQuery.ts

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { themeQueryKeys } from "../api/theme.queryKeys";
import { createThemeService } from "../services/theme.service";
import type { ThemeKey } from "../types/theme.types";

const themeService = createThemeService(apiClient);

export function useThemesQuery(workspaceId: string | null) {
    return useQuery({
        queryKey: workspaceId ? themeQueryKeys.list(workspaceId) : themeQueryKeys.lists(),
        queryFn: async () => {
            if (!workspaceId) {
                throw new Error("Workspace ID is required");
            }

            return themeService.getThemes(workspaceId);
        },
        enabled: workspaceId !== null,
        staleTime: 30_000,
    });
}

export function useThemeByKeyQuery(
    workspaceId: string | null,
    themeKey: ThemeKey | null
) {
    return useQuery({
        queryKey:
            workspaceId && themeKey
                ? themeQueryKeys.detail(workspaceId, themeKey)
                : themeQueryKeys.details(),
        queryFn: async () => {
            if (!workspaceId || !themeKey) {
                throw new Error("Workspace ID and theme key are required");
            }

            return themeService.getThemeByKey(workspaceId, themeKey);
        },
        enabled: workspaceId !== null && themeKey !== null,
        staleTime: 30_000,
    });
}