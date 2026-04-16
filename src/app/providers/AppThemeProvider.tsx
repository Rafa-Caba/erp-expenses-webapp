// src/app/providers/AppThemeProvider.tsx

import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { useScopeStore } from "../scope/scope.store";
import { useThemesQuery } from "../../features/themes/hooks/useThemesQuery";
import {
    isThemeKey,
    type ThemeKey,
    type ThemeRecord,
} from "../../features/themes/types/theme.types";
import { useWorkspaceSettingsQuery } from "../../features/workspaceSettings/hooks/useWorkspaceSettingsQuery";
import {
    createAppThemeFromDefinition,
    getFallbackThemeDefinition,
    getResolvedThemeDefinition,
    type ThemeDefinition,
} from "../theme/theme.utils";

type AppThemeContextValue = {
    activeThemeKey: ThemeKey;
    activeThemeDefinition: ThemeDefinition;
    availableThemes: ThemeRecord[];
    isLoading: boolean;
};

const AppThemeContext = React.createContext<AppThemeContextValue | null>(null);

type AppThemeProviderProps = {
    children: React.ReactNode;
};

function resolveActiveThemeKey(rawThemeValue: string | null | undefined): ThemeKey {
    if (isThemeKey(rawThemeValue)) {
        return rawThemeValue;
    }

    return "dark";
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
    const workspaceId = useScopeStore((state) => state.workspaceId);

    const workspaceSettingsQuery = useWorkspaceSettingsQuery(workspaceId);
    const themesQuery = useThemesQuery(workspaceId);

    const activeThemeKey = React.useMemo<ThemeKey>(() => {
        return resolveActiveThemeKey(workspaceSettingsQuery.data?.settings.theme);
    }, [workspaceSettingsQuery.data?.settings.theme]);

    const availableThemes = React.useMemo<ThemeRecord[]>(() => {
        return themesQuery.data?.themes ?? [];
    }, [themesQuery.data?.themes]);

    const activeThemeDefinition = React.useMemo<ThemeDefinition>(() => {
        if (workspaceId === null) {
            return getFallbackThemeDefinition("dark");
        }

        return getResolvedThemeDefinition(activeThemeKey, availableThemes);
    }, [activeThemeKey, availableThemes, workspaceId]);

    const muiTheme = React.useMemo(() => {
        return createAppThemeFromDefinition(activeThemeDefinition);
    }, [activeThemeDefinition]);

    const contextValue = React.useMemo<AppThemeContextValue>(
        () => ({
            activeThemeKey,
            activeThemeDefinition,
            availableThemes,
            isLoading:
                workspaceId !== null &&
                (workspaceSettingsQuery.isLoading || themesQuery.isLoading),
        }),
        [
            activeThemeDefinition,
            activeThemeKey,
            availableThemes,
            themesQuery.isLoading,
            workspaceId,
            workspaceSettingsQuery.isLoading,
        ]
    );

    return (
        <AppThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context = React.useContext(AppThemeContext);

    if (!context) {
        throw new Error("useAppTheme must be used within AppThemeProvider");
    }

    return context;
}