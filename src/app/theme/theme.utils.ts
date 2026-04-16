// src/app/theme/theme.utils.ts

import {
    alpha,
    createTheme,
    responsiveFontSizes,
    type Theme,
} from "@mui/material/styles";

import type {
    ThemeColors,
    ThemeKey,
    ThemeMode,
    ThemeRecord,
} from "../../features/themes/types/theme.types";

export type ThemeDefinition = {
    key: ThemeKey;
    name: string;
    description: string | null;
    mode: ThemeMode;
    colors: ThemeColors;
};

const darkColors: ThemeColors = {
    background: "#000000",
    surface: "#0A0A0A",
    surfaceAlt: "#141414",
    textPrimary: "#F5F5F5",
    textSecondary: "#A3A3A3",
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
    divider: "#262626",
};

const lightColors: ThemeColors = {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    surfaceAlt: "#F1F5F9",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    primary: "#2563EB",
    secondary: "#7C3AED",
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#0891B2",
    divider: "#E2E8F0",
};

const customizableColors: ThemeColors = {
    background: "#0B1220",
    surface: "#111827",
    surfaceAlt: "#1F2937",
    textPrimary: "#F9FAFB",
    textSecondary: "#CBD5E1",
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
    divider: "#334155",
};

export const fallbackThemeDefinitions: Record<ThemeKey, ThemeDefinition> = {
    dark: {
        key: "dark",
        name: "Dark",
        description: "Tema oscuro base del sistema.",
        mode: "dark",
        colors: darkColors,
    },
    light: {
        key: "light",
        name: "Light",
        description: "Tema claro base del sistema.",
        mode: "light",
        colors: lightColors,
    },
    customizable: {
        key: "customizable",
        name: "Personalizable",
        description: "Tema editable del workspace.",
        mode: "dark",
        colors: customizableColors,
    },
};

export function getFallbackThemeDefinition(themeKey: ThemeKey): ThemeDefinition {
    return fallbackThemeDefinitions[themeKey];
}

export function getResolvedThemeDefinition(
    activeThemeKey: ThemeKey,
    themes: ThemeRecord[]
): ThemeDefinition {
    const matchedTheme = themes.find(
        (theme) => theme.key === activeThemeKey && theme.isActive
    );

    if (!matchedTheme) {
        return getFallbackThemeDefinition(activeThemeKey);
    }

    return {
        key: matchedTheme.key,
        name: matchedTheme.name,
        description: matchedTheme.description,
        mode: matchedTheme.mode,
        colors: matchedTheme.colors,
    };
}

export function createAppThemeFromDefinition(definition: ThemeDefinition): Theme {
    const baseTheme = createTheme({
        palette: {
            mode: definition.mode,
            primary: {
                main: definition.colors.primary,
            },
            secondary: {
                main: definition.colors.secondary,
            },
            success: {
                main: definition.colors.success,
            },
            warning: {
                main: definition.colors.warning,
            },
            error: {
                main: definition.colors.error,
            },
            info: {
                main: definition.colors.info,
            },
            background: {
                default: definition.colors.background,
                paper: definition.colors.surface,
            },
            text: {
                primary: definition.colors.textPrimary,
                secondary: definition.colors.textSecondary,
            },
            divider: definition.colors.divider,
            action: {
                hover: alpha(definition.colors.primary, 0.08),
                selected: alpha(definition.colors.primary, 0.14),
                focus: alpha(definition.colors.primary, 0.16),
            },
        },
        shape: {
            borderRadius: 12,
        },
        typography: {
            fontFamily: [
                "Inter",
                "system-ui",
                "Avenir",
                "Helvetica",
                "Arial",
                "sans-serif",
            ].join(","),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    ":root": {
                        colorScheme: definition.mode,
                    },
                    html: {
                        width: "100%",
                        minHeight: "100%",
                    },
                    body: {
                        width: "100%",
                        minHeight: "100vh",
                        margin: 0,
                        backgroundColor: definition.colors.background,
                        color: definition.colors.textPrimary,
                    },
                    "#root": {
                        width: "100%",
                        minHeight: "100vh",
                    },
                    a: {
                        color: definition.colors.primary,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundImage: "none",
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                },
            },
            MuiButton: {
                defaultProps: {
                    disableElevation: true,
                },
            },
        },
    });

    return responsiveFontSizes(baseTheme);
}