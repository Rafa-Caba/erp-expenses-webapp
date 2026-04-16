// src/features/themes/types/theme.types.ts

import type {
    CollectionResponse,
    EntityResponse,
} from "../../../shared/types/api.types";
import type { IsoDateString } from "../../../shared/types/common.types";

export type ThemeKey = "dark" | "light" | "customizable";
export type ThemeMode = "dark" | "light";

export interface ThemeColors {
    background: string;
    surface: string;
    surfaceAlt: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    divider: string;
}

export interface ThemeRecord {
    id: string;
    workspaceId: string;
    key: ThemeKey;
    name: string;
    description: string | null;
    mode: ThemeMode;
    isBuiltIn: boolean;
    isEditable: boolean;
    isActive: boolean;
    colors: ThemeColors;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface UpdateThemePayload {
    name?: string;
    description?: string | null;
    isActive?: boolean;
    colors?: Partial<ThemeColors>;
}

export type ThemesResponse = CollectionResponse<"themes", ThemeRecord>;
export type ThemeResponse = EntityResponse<"theme", ThemeRecord>;

export function isThemeKey(value: string | null | undefined): value is ThemeKey {
    return value === "dark" || value === "light" || value === "customizable";
}