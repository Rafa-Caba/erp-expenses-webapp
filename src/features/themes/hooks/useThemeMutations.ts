// src/features/themes/hooks/useThemeMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../../shared/api/apiClient";
import { workspaceSettingsQueryKeys } from "../../workspaceSettings/api/workspace-settings.queryKeys";
import { themeQueryKeys } from "../api/theme.queryKeys";
import { createThemeService } from "../services/theme.service";
import type {
    ThemeKey,
    ThemeResponse,
    UpdateThemePayload,
} from "../types/theme.types";

const themeService = createThemeService(apiClient);

type UpdateThemeMutationPayload = {
    workspaceId: string;
    themeKey: ThemeKey;
    payload: UpdateThemePayload;
};

export function useUpdateThemeMutation() {
    const queryClient = useQueryClient();

    return useMutation<ThemeResponse, Error, UpdateThemeMutationPayload>({
        mutationFn: ({ workspaceId, themeKey, payload }) =>
            themeService.updateTheme(workspaceId, themeKey, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: themeQueryKeys.all,
            });

            queryClient.setQueryData(
                themeQueryKeys.detail(response.theme.workspaceId, response.theme.key),
                response
            );

            queryClient.invalidateQueries({
                queryKey: workspaceSettingsQueryKeys.all,
            });
        },
    });
}