// src/workspaces/types/workspace.types.ts

import type {
    CurrencyCode,
    IsoDateString,
    Nullable,
    WorkspaceKind,
    WorkspaceType,
    WorkspaceVisibility,
} from "../../../shared/types/common.types";
import type { CollectionResponse, EntityResponse } from "../../../shared/types/api.types";

export interface WorkspaceRecord {
    id: string;
    type: WorkspaceType;
    kind: WorkspaceKind;
    name: string;
    description: Nullable<string>;
    ownerUserId: string;
    currency: CurrencyCode;
    timezone: string;
    country: Nullable<string>;
    icon: Nullable<string>;
    color: Nullable<string>;
    visibility: WorkspaceVisibility;
    isActive: boolean;
    isArchived: boolean;
    isVisible: boolean;
    createdAt: IsoDateString;
    updatedAt: IsoDateString;
}

export interface WorkspaceListItem extends WorkspaceRecord {
    memberCount?: number;
}

export interface CreateWorkspacePayload {
    type: WorkspaceType;
    kind?: WorkspaceKind;
    name: string;
    description?: string;
    currency: CurrencyCode;
    timezone: string;
    country?: string;
    icon?: string;
    color?: string;
    visibility?: WorkspaceVisibility;
    isVisible?: boolean;
}

export interface UpdateWorkspacePayload {
    type?: WorkspaceType;
    kind?: WorkspaceKind;
    name?: string;
    description?: string;
    currency?: CurrencyCode;
    timezone?: string;
    country?: string;
    icon?: string;
    color?: string;
    visibility?: WorkspaceVisibility;
    isActive?: boolean;
    isArchived?: boolean;
    isVisible?: boolean;
}

export interface GetWorkspacesQuery {
    includeArchived?: boolean;
    includeInactive?: boolean;
}

export type WorkspacesResponse = CollectionResponse<"workspaces", WorkspaceListItem>;
export type WorkspaceResponse = EntityResponse<"workspace", WorkspaceRecord>;