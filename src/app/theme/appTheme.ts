// src/app/theme/appTheme.ts

import { createAppThemeFromDefinition, getFallbackThemeDefinition } from "./theme.utils";

export const appTheme = createAppThemeFromDefinition(
    getFallbackThemeDefinition("dark")
);