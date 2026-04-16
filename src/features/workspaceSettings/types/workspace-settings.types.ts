// src/features/workspaceSettings/types/workspace-settings.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
} from "../../../shared/types/common.types";
import type { EntityResponse } from "../../../shared/types/api.types";
import type { ThemeKey } from "../../themes/types/theme.types";

export type WorkspaceLanguage = "es-MX" | "en-US";
export type WorkspaceDateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
export type WorkspaceTimeFormat = "12h" | "24h";
export type WorkspaceWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type WorkspaceDecimalSeparator = "." | ",";
export type WorkspaceThousandSeparator = "," | "." | " ";

export interface WorkspaceSettingsRecord {
    id: string;
    workspaceId: string;
    defaultCurrency: CurrencyCode;
    language: WorkspaceLanguage;
    timezone: string;
    dateFormat: WorkspaceDateFormat;
    timeFormat: WorkspaceTimeFormat;
    theme: Nullable<ThemeKey>;
    notificationsEnabled: boolean;
    budgetAlertsEnabled: boolean;
    debtAlertsEnabled: boolean;
    allowMemberEdits: boolean;
    weekStartsOn: Nullable<WorkspaceWeekStartsOn>;
    decimalSeparator: Nullable<WorkspaceDecimalSeparator>;
    thousandSeparator: Nullable<WorkspaceThousandSeparator>;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface UpdateWorkspaceSettingsPayload {
    defaultCurrency?: CurrencyCode;
    language?: WorkspaceLanguage;
    timezone?: string;
    dateFormat?: WorkspaceDateFormat;
    timeFormat?: WorkspaceTimeFormat;
    theme?: ThemeKey;
    notificationsEnabled?: boolean;
    budgetAlertsEnabled?: boolean;
    debtAlertsEnabled?: boolean;
    allowMemberEdits?: boolean;
    weekStartsOn?: WorkspaceWeekStartsOn;
    decimalSeparator?: WorkspaceDecimalSeparator;
    thousandSeparator?: WorkspaceThousandSeparator;
    isVisible?: boolean;
}

export type WorkspaceSettingsResponse = EntityResponse<
    "settings",
    WorkspaceSettingsRecord
>;