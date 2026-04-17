// src/app/shell/AppShell.utils.tsx

import type { ThemeKey } from "../../features/themes/types/theme.types";
import type { AppShellScopeType, AppShellWorkspaceType } from "./AppShell.types";

export function getWorkspaceTypeLabel(
    workspaceType: AppShellWorkspaceType
): string {
    switch (workspaceType) {
        case "PERSONAL":
            return "Personal";
        case "HOUSEHOLD":
            return "Casa";
        case "BUSINESS":
            return "Negocio";
    }
}

export function getThemeLabel(themeKey: ThemeKey): string {
    switch (themeKey) {
        case "dark":
            return "Dark";
        case "light":
            return "Light";
        case "customizable":
            return "Personalizable";
    }
}

export function getRemindersBasePath(
    scopeType: AppShellScopeType,
    workspaceId: string | null
): string {
    if (scopeType === "PERSONAL") {
        return "/app/personal/reminders";
    }

    if (!workspaceId) {
        return "/app/workspaces";
    }

    return `/app/w/${workspaceId}/reminders`;
}