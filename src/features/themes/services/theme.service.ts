// src/features/themes/services/theme.service.ts

import type { AxiosInstance } from "axios";

import type {
    ThemeKey,
    ThemeResponse,
    ThemesResponse,
    UpdateThemePayload,
} from "../types/theme.types";

export function createThemeService(apiClient: AxiosInstance) {
    return {
        getThemes(workspaceId: string): Promise<ThemesResponse> {
            return apiClient
                .get<ThemesResponse>(`/api/workspaces/${workspaceId}/themes`)
                .then(({ data }) => data);
        },

        getThemeByKey(workspaceId: string, themeKey: ThemeKey): Promise<ThemeResponse> {
            return apiClient
                .get<ThemeResponse>(`/api/workspaces/${workspaceId}/themes/${themeKey}`)
                .then(({ data }) => data);
        },

        updateTheme(
            workspaceId: string,
            themeKey: ThemeKey,
            payload: UpdateThemePayload
        ): Promise<ThemeResponse> {
            return apiClient
                .patch<ThemeResponse>(
                    `/api/workspaces/${workspaceId}/themes/${themeKey}`,
                    payload
                )
                .then(({ data }) => data);
        },
    };
}